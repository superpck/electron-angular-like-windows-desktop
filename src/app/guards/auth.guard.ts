import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

/** Protects routes that require authentication. Redirects to /login if not logged in. */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

/** Prevents logged-in users from accessing the login page. Redirects to /desktop instead. */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.isLoggedIn()) return true;
  return router.createUrlTree(['/desktop']);
};
