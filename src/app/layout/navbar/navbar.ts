import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  cartCount = signal(0);
  wishlistCount = signal(0);

  categories = [
    { name: 'Electronics', route: '/products/electronics' },
    { name: 'Fashion', route: '/products/fashion' },
    { name: 'Home & Living', route: '/products/home' },
    { name: 'Beauty', route: '/products/beauty' },
    { name: 'Sports', route: '/products/sports' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-wrap')) {
      this.isUserMenuOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
  }
}
