import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// تعريف المسارات
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// دالة للتحقق من دور الأدمن
const checkAdminRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

// حماية المسارات
router.beforeEach((to, from, next) => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      
      if (to.meta.requiresAuth) {
        if (user) {
          // التحقق من صلاحيات الأدمن إذا كانت مطلوبة
          if (to.meta.requiresAdmin) {
            const isAdmin = await checkAdminRole(user.uid);
            if (isAdmin) {
              resolve(next())
            } else {
              resolve(next('/'))
            }
          } else {
            resolve(next())
          }
        } else {
          resolve(next('/login'))
        }
      } else {
        // إذا كان المستخدم مسجل دخول ومحاولة الوصول لصفحة تسجيل الدخول أو التسجيل، إعادة توجيه للرئيسية
        if (user && (to.path === '/login' || to.path === '/register')) {
          resolve(next('/'))
        } else {
          resolve(next())
        }
      }
    })
  })
})

export default router
