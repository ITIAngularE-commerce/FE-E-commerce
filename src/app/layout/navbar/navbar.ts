import { CartService } from './../../core/services/cart.service';
import { Component, signal, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category.interface';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private catSvc = inject(CategoryService);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  // cartCount = signal(0);
  // wishlistCount = signal(0);
  categories = signal<Category[]>([]);

  //cart
  private CartService = inject(CartService);
  cartCount = this.CartService.cartCount;

  //wishlist
  private wishlistService = inject(WishlistService);
  wishlistCount = this.wishlistService.wishlistCount;
  ngOnInit() {
    this.catSvc.getAll().subscribe({
      next: (res) => this.categories.set(res.data),
    });
    this.wishlistService.getCount().subscribe();
    this.CartService.getCartCount().subscribe();

  }



  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (!(e.target as HTMLElement).closest('.user-menu-wrap')) this.isUserMenuOpen.set(false);
  }

  onSearch(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value.trim();
      if (value) this.router.navigate(['/products'], { queryParams: { Search: value } });
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
