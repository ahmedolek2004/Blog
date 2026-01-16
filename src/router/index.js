import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'

// تعريف المسارات
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حماية المسارات
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.meta.requiresAuth && !user) {
    next('/Login')
  } else {
    next()
  }
})

export default router
