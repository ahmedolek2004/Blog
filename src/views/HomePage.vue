<script setup>
import { auth } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userEmail = ref('');

// التأكد من جلب بيانات المستخدم عند تحميل الصفحة
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email;
    } else {
      router.push('/login');
    }
  });
});

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>

<template>
  <div class="bg-gray-900 min-h-screen">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
        <div class="flex lg:flex-1">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" class="h-8 w-auto" />
          </a>
        </div>

        <div class="hidden lg:flex lg:gap-x-12">
          <a href="#" class="text-sm/6 font-semibold text-white">Product</a>
          <a href="#" class="text-sm/6 font-semibold text-white">Features</a>
          <a href="#" class="text-sm/6 font-semibold text-white">Marketplace</a>
          <a href="#" class="text-sm/6 font-semibold text-white">Company</a>
        </div>

        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <span v-if="userEmail" class="text-gray-300 text-sm italic">
            {{ userEmail }}
          </span>
          <button @click="logout" class="text-sm/6 font-semibold text-white bg-red-600 px-4 py-1 rounded-md hover:bg-red-500 transition">
            Sign Out <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
    </header>

    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div aria-hidden="true" class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
      </div>

      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div class="text-center">
          <h1 class="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Data to enrich your online business
          </h1>
          <p class="mt-8 text-lg font-medium text-gray-400 sm:text-xl/8">
            Welcome back! You are successfully logged in to your dashboard.
          </p>

          <div class="mt-10 block lg:hidden">
             <p class="text-indigo-400 mb-4">{{ userEmail }}</p>
             <button @click="logout" class="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400">Sign Out</button>
          </div>

          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Get started</a>
            <a href="#" class="text-sm/6 font-semibold text-white">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
