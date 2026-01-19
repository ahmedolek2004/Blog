<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const route = useRoute();
const { currentUser, isAdmin, checkAdminRole } = useAuth();

const title = ref('');
const content = ref('');
const postId = ref('');
const authorId = ref('');
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  postId.value = route.params.id;
  
  if (!currentUser.value) {
    router.push('/login');
    return;
  }

  try {
    // جلب بيانات البوست
    const postDoc = await getDoc(doc(db, 'posts', postId.value));
    
    if (!postDoc.exists()) {
      error.value = 'Post not found';
      router.push('/');
      return;
    }

    const postData = postDoc.data();
    title.value = postData.title;
    content.value = postData.content;
    authorId.value = postData.authorId;

    // التحقق من الصلاحيات
    const userIsAdmin = await checkAdminRole(currentUser.value.uid);
    if (currentUser.value.uid !== authorId.value && !userIsAdmin) {
      error.value = 'You do not have permission to edit this post';
      router.push('/');
      return;
    }

    isLoading.value = false;
  } catch (err) {
    console.error(err);
    error.value = 'Error loading post';
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  if (!title.value || !content.value) {
    alert('Please fill all fields');
    return;
  }

  try {
    await updateDoc(doc(db, 'posts', postId.value), {
      title: title.value,
      content: content.value,
      updatedAt: serverTimestamp()
    });

    router.push('/');
  } catch (err) {
    console.error(err);
    alert('Error updating post: ' + err.message);
  }
};
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white">
    <Navbar />
    <div class="max-w-2xl mx-auto py-12 px-6">
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold mb-6">Edit Post</h2>

        <div v-if="isLoading" class="text-center py-8">
          <p class="text-gray-400">Loading...</p>
        </div>

        <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
          {{ error }}
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-gray-400 mb-2">Title</label>
            <input
              v-model="title"
              type="text"
              required
              class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Content</label>
            <textarea
              v-model="content"
              rows="10"
              required
              class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>
          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500 transition"
            >
              Update Post
            </button>
            <button
              type="button"
              @click="router.push('/')"
              class="flex-1 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
