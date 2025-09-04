import type { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { ProjectsPage } from './pages/projects-page/projects-page';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    // canMatch [],
    children: [
      // {
      //   path: '',
      //   component: DashboardPage,
      // },
      {
        path: 'projects',
        component: ProjectsPage,
      },
      // {
      //   path: 'images',
      //   component: ImagesPage,
      // },
      {
        path: '**',
        redirectTo: 'projects',
      },
    ],
  },
];

export default adminRoutes;
