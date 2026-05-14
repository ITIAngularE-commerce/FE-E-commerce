import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      // {
      //   path: 'products',
      //   loadComponent: () =>
      //     import('./features/products/product-list/product-list').then((m) => m.ProductList),
      // },
      // {
      //   path: 'products/:id',
      //   loadComponent: () =>
      //     import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
      // },
      // {
      //   path: 'cart',
      //   canActivate: [authGuard],
      //   loadComponent: () => import('./features/cart/cart-page/cart-page').then((m) => m.CartPage),
      // },
      // {
      //   path: 'orders',
      //   canActivate: [authGuard],
      //   loadComponent: () =>
      //     import('./features/orders/order-list/order-list').then((m) => m.OrderList),
      // },
      // {
      //   path: 'orders/:id',
      //   canActivate: [authGuard],
      //   loadComponent: () =>
      //     import('./features/orders/order-detail/order-detail').then((m) => m.OrderDetail),
      // },
      // {
      //   path: 'wishlist',
      //   canActivate: [authGuard],
      //   loadComponent: () => import('./features/user/wishlist/wishlist').then((m) => m.Wishlist),
      // },
      // {
      //   path: 'profile',
      //   canActivate: [authGuard],
      //   loadComponent: () => import('./features/user/profile/profile').then((m) => m.Profile),
      // },
      // {
      //   path: 'seller',
      //   canActivate: [authGuard, roleGuard(['Seller'])],
      //   loadComponent: () =>
      //     import('./features/seller/dashboard/seller-dashboard').then((m) => m.SellerDashboard),
      // },
      // {
      //   path: 'admin',
      //   canActivate: [authGuard, roleGuard(['Admin'])],
      //   loadComponent: () =>
      //     import('./features/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      // },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
