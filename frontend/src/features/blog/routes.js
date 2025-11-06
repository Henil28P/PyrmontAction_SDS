export const blogRoutes = [
  {
    path: '/blogs',
    name: 'Blogs',
    component: () => import('./pages/BlogsPage.vue'),
    meta: {
      title: 'Blogs - Pyrmont Action'
    }
  },
  {
    path: '/blogs/submit',
    name: 'BlogSubmit',
    component: () => import('./pages/BlogSubmit.vue'),
    meta: {
      title: 'Submit Blog - Pyrmont Action'
    }
  }
]
