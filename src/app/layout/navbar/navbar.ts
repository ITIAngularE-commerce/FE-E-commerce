import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  cartCount = signal(2);
  wishlistCount = signal(3);

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

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }
}
