import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'desktop',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/desktop/desktop').then((m) => m.Desktop),
  },
];

