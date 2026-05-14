import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
