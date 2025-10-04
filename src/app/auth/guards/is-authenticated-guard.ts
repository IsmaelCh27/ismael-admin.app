import { inject } from '@angular/core';
import {
  type CanMatchFn,
  type Route,
  Router,
  type UrlSegment,
} from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

export const IsAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();

  if (!session) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  return true;
};
