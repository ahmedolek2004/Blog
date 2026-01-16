import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});
