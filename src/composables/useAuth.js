import { ref } from 'vue';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Singleton state
let authStateInitialized = false;
const globalState = {
  currentUser: ref(null),
  userEmail: ref(''),
  userName: ref(''),
  isAdmin: ref(false),
  isLoading: ref(true)
};

let unsubscribeAuth = null;

export function useAuth() {
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

  // Initialize auth state listener only once
  if (!authStateInitialized) {
    authStateInitialized = true;
    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        globalState.currentUser.value = user;
        globalState.userEmail.value = user.email;
        globalState.userName.value = user.displayName || user.email;
        globalState.isAdmin.value = await checkAdminRole(user.uid);
      } else {
        globalState.currentUser.value = null;
        globalState.userEmail.value = '';
        globalState.userName.value = '';
        globalState.isAdmin.value = false;
      }
      globalState.isLoading.value = false;
    });
  }
// أضف هذه الدالة داخل الـ return في نهاية useAuth
return {
  currentUser: globalState.currentUser,
  userEmail: globalState.userEmail,
  userName: globalState.userName,
  isAdmin: globalState.isAdmin,
  isLoading: globalState.isLoading,
  checkAdminRole,
  // إضافة هذه الدالة تجعل المتغير "مستخدماً" وتفيد في تنظيف الكود لاحقاً
  logoutCleanup: () => {
    if (unsubscribeAuth) unsubscribeAuth();
  }
};
};
