import { inject } from '@angular/core';
import { type CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

export const NotAuthenticatedGuard: CanMatchFn = async (
  // route: Route,
  // segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();

  if (session) {
    router.navigateByUrl('/admin');
    return false;
  }

  return true;
};
