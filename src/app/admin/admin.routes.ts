import type { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { ExperiencesPage } from './pages/experiences-page/experiences-page';
import { ImagesPage } from './pages/images-page/images-page';
import { ProjectsPage } from './pages/projects-page/projects-page';
import { TechnologiesPage } from './pages/technologies-page/technologies-page';

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
        path: 'images',
        component: ImagesPage,
      },
      {
        path: 'technologies',
        component: TechnologiesPage,
      },
      {
        path: '**',
        redirectTo: 'projects',
      },
    ],
  },
];

export default adminRoutes;
