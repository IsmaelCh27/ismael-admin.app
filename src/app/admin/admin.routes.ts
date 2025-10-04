import type { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { ExperiencesPage } from './pages/experiences-page/experiences-page';
import { ProjectsPage } from './pages/projects-page/projects-page';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'projects',
        component: ProjectsPage,
      },
      {
        path: 'experiences',
        component: ExperiencesPage,
      },
      {
        path: '**',
        redirectTo: 'projects',
      },
    ],
  },
];

export default adminRoutes;
