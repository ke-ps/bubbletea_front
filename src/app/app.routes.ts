import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { publicGuard } from './core/public.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/public/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/public/register/register').then((m) => m.Register),
  },
{
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/private/home/home').then((m) => m.Home),
  },
  {
    path: 'bubble-teas/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/private/bubble-tea-detail/bubble-tea-detail').then(
        (m) => m.BubbleTeaDetail,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/public/not-found/not-found').then((m) => m.NotFound),
  },
];
