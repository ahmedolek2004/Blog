<script setup>
  import { ref, onMounted } from 'vue';
  import { auth, db } from '../firebase/config';
  import { signOut, onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';

  // تغيير اسم المكون برمجياً لتجنب تحذير ESLint
  defineOptions({
    name: 'AppNavbar'
  });

  const router = useRouter();
  const userEmail = ref('');
  const userName = ref('');
  const isAdmin = ref(false);
  const currentUser = ref(null);

  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser.value = user;
        userEmail.value = user.email;
        userName.value = user.displayName || user.email.split('@')[0];

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            isAdmin.value = userDoc.data().role === 'admin';
          }
        } catch  {
          console.warn('Role check skipped');
        }
      } else {
        currentUser.value = null;
        userEmail.value = '';
        userName.value = '';
        isAdmin.value = false;
      }
    });
  });

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch {
      // حذفنا المتغير (error) هنا تماماً لأنه غير مستخدم
      console.log("Logout failed");
    }
  };
  </script>

  <template>
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-indigo-500 hover:text-indigo-400">
              My Blog
            </router-link>
          </div>

          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Home
            </router-link>

            <router-link
              to="/create"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Create Post
            </router-link>

            <router-link
              v-if="isAdmin"
              to="/admin"
              class="text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition bg-yellow-400/10 border border-yellow-400/20"
            >
              Admin Panel
            </router-link>

            <div class="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              <div class="text-right hidden sm:block">
                <p class="text-sm text-gray-300">{{ userName }}</p>
                <p v-if="isAdmin" class="text-[10px] uppercase tracking-wider text-yellow-500 font-bold">Admin</p>
              </div>
              <button
                @click="logout"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>

  <style scoped>
  /* حذفنا @apply لحل مشكلة Tailwind v4 وتجنب أخطاء التحميل */
  .router-link-active:not(.text-yellow-400) {
    color: #818cf8; /* indigo-400 */
    background-color: #374151; /* gray-700 */
  }
  </style>
