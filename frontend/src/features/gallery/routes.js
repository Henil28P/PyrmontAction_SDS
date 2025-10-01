// src/features/gallery/routes.js
export const galleryRoutes = [
    {
        path: '/gallery',
        component: () => import('./GalleryLayout.vue'),
        children: [
            {
                path: '',
                name: 'gallery',
                component: () => import('./pages/GalleryView.vue'),
            },
        ],
    },
]
