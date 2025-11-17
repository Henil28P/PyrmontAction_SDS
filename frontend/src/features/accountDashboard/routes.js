import memberDashboard from "./pages/memberDashboard.vue"
import adminDashboard from "./pages/adminDashboard.vue"

export const accountRoutes = [
  {
    path: '/dashboard/member',
    name: 'memberDashboard',
    component: memberDashboard
  },

  {
    path: '/dashboard/admin',
    name: 'adminDashboard',
    component: adminDashboard
  },

  {
    path: '/dashboard/editor',
    name: 'editorDashboard',
    component: adminDashboard
  },

]
