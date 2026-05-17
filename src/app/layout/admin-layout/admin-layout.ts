import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  authService = inject(AuthService);
  isSidebarOpen = signal(true);

  navItems = [
    { label: 'Dashboard', route: '/admin', icon: 'dashboard', exact: true },
    { label: 'Users', route: '/admin/users', icon: 'users', exact: false },
    { label: 'Orders', route: '/admin/orders', icon: 'orders', exact: false },
    { label: 'Products', route: '/admin/products', icon: 'products', exact: false },
    { label: 'Categories', route: '/admin/categories', icon: 'categories', exact: false },
  ];

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }
}
