import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'          // the array we just built
import { useUserStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
})

// Add route guards for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = useUserStore().isAuthenticated;
  const role = useUserStore().getRole;
  
  // Routes that require authentication
  const memberRoutes = [
    'memberDashboard', // Add both variations to be safe
    'minutesMemberView',
    // Add other protected route names here
  ];
  
  // Routes that require admin role
  const adminRoutes = [
    // Add other admin route names here
  ];

  const editorRoutes = [
    // Add other editor route names here
  ];

  const managerRoutes = [
    'adminDashboard',
    'editorDashboard',
    // Add other manager route names here
  ];

  if (memberRoutes.includes(to.name) && !(isAuthenticated && role === 'member')) {
    // Redirect to login if trying to access protected route without authentication
    useUserStore().logout(); // Clear any stale auth data
    next({ name: 'Login' });
  } else if (adminRoutes.includes(to.name) && !(isAuthenticated && role === 'admin')) {
    // Redirect to login if trying to access admin route without proper role
    useUserStore().logout(); // Clear any stale auth data
    next({ name: 'Login' });
  } else if (editorRoutes.includes(to.name) && !(isAuthenticated && role === 'editor')) {
    // Redirect to login if trying to access editor route without proper role
    useUserStore().logout(); // Clear any stale auth data
    next({ name: 'Login' });
  } else if (managerRoutes.includes(to.name) && !(isAuthenticated && (role === 'admin' || role === 'editor'))) {
    // Redirect to login if trying to access manager route without proper role
    useUserStore().logout(); // Clear any stale auth data
    next({ name: 'Login' });
  } else {
    next(); // Allow navigation
  }
});

export default router
