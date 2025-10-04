import type { Routes } from '@angular/router';
import { IsAuthenticatedGuard } from '@auth/guards/is-authenticated-guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.routes').then((m) => m.default),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.routes').then((m) => m.default),
    canMatch: [IsAuthenticatedGuard],
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
];
