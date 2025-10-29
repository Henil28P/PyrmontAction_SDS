export const eventsRoutes = [
  {
    path: '/events',
    name: 'Events',
    component: () => import('./pages/EventsPage.vue'),
    meta: {
      title: 'Events - Pyrmont Action'
    }
  }
]
