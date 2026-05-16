import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './seller-layout.html',
  styleUrl: './seller-layout.css',
})
export class SellerLayout {
  authService = inject(AuthService);
  isSidebarOpen = signal(true);

  navItems = [
    { label: 'Dashboard', route: '/seller', icon: 'dashboard', exact: true },
    { label: 'My Products', route: '/seller/products', icon: 'products', exact: false },
    { label: 'Orders', route: '/seller/orders', icon: 'orders', exact: false },
    { label: 'Settings', route: '/seller/settings', icon: 'settings', exact: false },
  ];

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }
}
