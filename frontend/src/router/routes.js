import { homeRoutes }     from '~features/home/routes'
import { aboutRoutes }    from '~features/about/routes'
import { contactRoutes }  from '~features/contact/routes'
import { galleryRoutes }  from '~features/gallery/routes'
import { projectsRoutes } from '~features/projects/routes'
import { joinusRoutes }   from '~features/JoinUs/routes'
import { loginRoutes }     from '~features/Login/routes'
import { accountRoutes }     from '~features/accountDashboard/routes'
import editorialDashboardRoutes from '~features/editorialDashboard/routes'

export const routes = [
    ...homeRoutes,
    ...aboutRoutes,
    ...contactRoutes,
    ...galleryRoutes,
    ...projectsRoutes,
    ...joinusRoutes,
    ...loginRoutes,
    ...accountRoutes,
    ...editorialDashboardRoutes
]
