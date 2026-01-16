<script setup>
import { ref } from 'vue';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, RouterLink } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch {
    error.value = "Incorrect email or password.";
  }
};
</script>

<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center p-6">

    <div class="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl">

      <div class="flex justify-center mb-6">
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" class="h-10 w-auto" />
      </div>

      <h2 class="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="email@example.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
        </div>

        <div v-if="error" class="text-red-400 text-sm bg-red-400/10 p-2 rounded border border-red-400/20 text-center">
          {{ error }}
        </div>

        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition">
          Sign In
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-400">
        Don't have an account?
        <RouterLink to="/register" class="text-indigo-400 hover:underline">Register</RouterLink>
      </p>
    </div>
  </div>
</template>
