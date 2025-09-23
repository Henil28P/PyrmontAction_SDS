import { useAuthStore } from '../stores/auth'

export function setupAuthGuards(router) {
  // Initialize auth store on app start
  const authStore = useAuthStore()
  authStore.initializeAuth()

  // Global navigation guard
  router.beforeEach(async (to, from, next) => {
    // Check if route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (requiresAuth) {
      if (!authStore.isAuthenticated) {
        // Not authenticated, redirect to login
        next({ 
          path: '/login', 
          query: { redirect: to.fullPath } 
        })
        return
      }

      // Check role requirements
      const requiredRole = to.meta.requiredRole
      if (requiredRole && !authStore.hasRole(requiredRole)) {
        // User doesn't have required role
        console.warn(`Access denied. Required role: ${requiredRole}, User role: ${authStore.user?.role}`)
        next({ path: '/unauthorized' })
        return
      }
    }

    // Check if authenticated user is trying to access login page
    if (to.path === '/login' && authStore.isAuthenticated) {
      // Redirect to appropriate dashboard
      if (authStore.isAdmin) {
        next('/admin')
      } else if (authStore.isMember) {
        next('/member')
      } else {
        next('/')
      }
      return
    }

    next()
  })
}

// Navigation guard for specific route protection
export function requireAuth(to, from, next) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
}

// Role-based navigation guard
export function requireRole(roles) {
  return (to, from, next) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      next({ 
        path: '/login', 
        query: { redirect: to.fullPath } 
      })
    } else if (!authStore.hasRole(roles)) {
      next('/unauthorized')
    } else {
      next()
    }
  }
}

// Admin only guard
export function requireAdmin(to, from, next) {
  return requireRole(['admin'])(to, from, next)
}

// Member or Admin guard
export function requireMember(to, from, next) {
  return requireRole(['member', 'admin'])(to, from, next)
}