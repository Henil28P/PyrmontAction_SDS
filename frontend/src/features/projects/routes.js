// src/features/projects/routes.js
export const projectsRoutes = [
    
    {
        path: '/projects',
        component: () => import('./ProjectsLayout.vue'),
        children: [
            {
                path: ':projectType',
                name: 'projects',
                component: () => import('./pages/ProjectsView.vue'),
            },
        ],
    },
    

    {
        path: '/projects/:projectType',
        children: [
            {
                path: ':projectId',
                name: 'Individual Projects',
                component: () => import('./pages/IndividualProjectView.vue'),
            },
        ],
    },
]

