<script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase/config';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { useRouter } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import { useAuth } from '../composables/useAuth';

  const title = ref('');
  const content = ref('');
  const router = useRouter();
  const { currentUser } = useAuth();

  // متطلب: الدخول للمسجلين فقط
  onMounted(() => {
    if (!currentUser.value) {
      router.push('/login');
    }
  });

  const handleSubmit = async () => {
    if (!title.value || !content.value) return alert("Please fill all fields");

    try {
      // حفظ المنشور في Firestore
      await addDoc(collection(db, 'posts'), {
        title: title.value,
        content: content.value,
        authorId: currentUser.value.uid,
        authorEmail: currentUser.value.email,
        createdAt: serverTimestamp()
      });

      router.push('/'); // العودة للرئيسية بعد الإرسال
    } catch (err) {
      console.error(err);
    }
  };
  </script>

  <template>
    <div class="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div class="max-w-2xl mx-auto py-12 px-6">
        <div class="bg-gray-800 p-8 rounded-lg shadow-xl">
          <h2 class="text-3xl font-bold mb-6">Create New Post</h2>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-gray-400 mb-2">Title</label>
              <input v-model="title" type="text" required class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Content</label>
              <textarea v-model="content" rows="10" required class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"></textarea>
            </div>
            <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500 transition">
              Submit Post
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
