<script setup>
import { ref } from 'vue';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter, RouterLink } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const error = ref(null);

const handleRegister = async () => {
  error.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email.value, password.value);
    if(res.user && name.value){
        await updateProfile(res.user, { displayName: name.value });
    }
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center relative isolate overflow-hidden py-12 px-6">

    <div aria-hidden="true" class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
      <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
    </div>

    <div class="w-full max-w-md z-10">
      <div class="flex justify-center mb-6">
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Logo" class="h-10 w-auto" />
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h2 class="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
        <p class="text-gray-400 text-center mb-8 text-sm">Join us to start your journey.</p>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-200 mb-1.5">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-200 mb-1.5">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="name@example.com"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-200 mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-200 mb-1.5">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center font-medium">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transform transition active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-gray-400">
          Already have an account?
          <RouterLink to="/login" class="text-indigo-400 hover:text-indigo-300 font-medium transition">Login</RouterLink>
        </p>
      </div>
    </div>

    <div aria-hidden="true" class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
      <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
    </div>
  </div>
</template>
