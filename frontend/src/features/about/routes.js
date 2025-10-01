// src/features/about/routes.js
export const aboutRoutes = [
    {
        path: '/about',
        component: () => import('./AboutLayout.vue'),
        children: [
            {
                path: '',
                name: 'about',
                component: () => import('./pages/AboutUsView.vue'),
            },
        ],
    },
]
