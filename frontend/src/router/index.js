import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupAuthGuards } from './authGuards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
})

// Setup authentication guards
setupAuthGuards(router)

export default router
