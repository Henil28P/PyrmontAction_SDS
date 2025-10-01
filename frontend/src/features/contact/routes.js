// src/features/contact/routes.js
export const contactRoutes = [
    {
        path: '/contact',
        component: () => import('./ContactLayout.vue'),
        children: [
            {
                path: '',
                name: 'contact',
                component: () => import('./pages/ContactView.vue'),
            },
        ],
    },
]
