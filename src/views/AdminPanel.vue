<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const { currentUser, isAdmin } = useAuth();

const posts = ref([]);
const users = ref([]);
const isLoading = ref(true);
const activeTab = ref('posts');

onMounted(async () => {
  if (!currentUser.value) {
    router.push('/login');
    return;
  }

  if (!isAdmin.value) {
    router.push('/');
    return;
  }

  // جلب البوستات
  const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  onSnapshot(postsQuery, (snapshot) => {
    posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // جلب المستخدمين
  const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  onSnapshot(usersQuery, (snapshot) => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  isLoading.value = false;
});

const handleDeletePost = async (postId) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  }
};

const handleDeleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleString();
  }
  return new Date(timestamp).toLocaleString();
};
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white">
    <Navbar />
    <div class="max-w-7xl mx-auto py-12 px-6">
      <h1 class="text-4xl font-bold mb-8 text-yellow-400">Admin Panel</h1>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-gray-700">
        <button
          @click="activeTab = 'posts'"
          :class="[
            'px-6 py-3 font-medium transition',
            activeTab === 'posts'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-white'
          ]"
        >
          Posts ({{ posts.length }})
        </button>
        <button
          @click="activeTab = 'users'"
          :class="[
            'px-6 py-3 font-medium transition',
            activeTab === 'users'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-white'
          ]"
        >
          Users ({{ users.length }})
        </button>
      </div>

      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'" class="space-y-4">
        <div v-if="posts.length === 0" class="text-gray-500 text-center py-8">
          No posts found.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-gray-800 p-6 rounded-xl border border-gray-700"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-indigo-400 mb-2">{{ post.title }}</h3>
                <p class="text-gray-300 mb-4">{{ post.content }}</p>
                <div class="flex gap-4 text-sm text-gray-500">
                  <span>By: {{ post.authorEmail }}</span>
                  <span>Created: {{ formatDate(post.createdAt) }}</span>
                  <span v-if="post.updatedAt">Updated: {{ formatDate(post.updatedAt) }}</span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <router-link
                  :to="`/edit/${post.id}`"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition"
                >
                  Edit
                </router-link>
                <button
                  @click="handleDeletePost(post.id)"
                  class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-4">
        <div v-if="users.length === 0" class="text-gray-500 text-center py-8">
          No users found.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full bg-gray-800 rounded-xl border border-gray-700">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="px-6 py-4 text-left text-gray-300 font-semibold">Email</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold">Name</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold">Role</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold">Created</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td class="px-6 py-4 text-gray-300">{{ user.email }}</td>
                <td class="px-6 py-4 text-gray-300">{{ user.displayName || 'N/A' }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      user.role === 'admin'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-gray-600 text-gray-300'
                    ]"
                  >
                    {{ user.role || 'user' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="handleDeleteUser(user.id)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
