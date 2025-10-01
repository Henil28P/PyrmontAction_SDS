// src/features/home/routes.js
export const homeRoutes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./pages/HomeView.vue'),
    },
]
