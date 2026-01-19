<script setup>
  import { db } from '../firebase/config';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
  import Navbar from '../components/Navbar.vue';
  import { useAuth } from '../composables/useAuth';

  const posts = ref([]);
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();

  // 1. جلب المنشورات وترتيبها (الأحدث أولاً)
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 2. التحقق من حالة المستخدم
  onMounted(() => {
    if (!currentUser.value) {
      router.push('/login');
    }
  });

  // 3. دالة الحذف مع التأكيد
  const handleDelete = async (postId, authorId) => {
    if (!currentUser.value) return;
    
    const isOwner = currentUser.value.uid === authorId;
    
    if (!isOwner && !isAdmin.value) {
      alert('You do not have permission to delete this post');
      return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const canEdit = (post) => {
    if (!currentUser.value) return false;
    return currentUser.value.uid === post.authorId || isAdmin.value;
  };

  const canDelete = (post) => {
    if (!currentUser.value) return false;
    return currentUser.value.uid === post.authorId || isAdmin.value;
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

      <div class="max-w-4xl mx-auto py-12 px-6">
        <h2 class="text-4xl font-bold mb-10">Latest Feed</h2>

        <div v-if="posts.length === 0" class="text-gray-500 text-center py-8">No posts found.</div>

        <div class="space-y-8">
          <div v-for="post in posts" :key="post.id" class="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
            <h3 class="text-2xl font-bold text-indigo-400 mb-2">{{ post.title }}</h3>
            <p class="text-gray-300 mb-4 whitespace-pre-wrap">{{ post.content }}</p>

            <div class="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-700">
              <span>By: {{ post.authorEmail }}</span>
              <div class="flex gap-4">
                <span>Created: {{ formatDate(post.createdAt) }}</span>
                <span v-if="post.updatedAt" class="text-gray-600">Updated: {{ formatDate(post.updatedAt) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="canEdit(post) || canDelete(post)" class="absolute top-6 right-6 flex gap-2">
              <router-link
                v-if="canEdit(post)"
                :to="`/edit/${post.id}`"
                class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition"
              >
                Edit
              </router-link>
              <button
                v-if="canDelete(post)"
                @click="handleDelete(post.id, post.authorId)"
                class="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
