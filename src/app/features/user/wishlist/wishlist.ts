import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistItem } from '../../../interfaces/wishlist.interface';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  items = signal<WishlistItem[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  removingId = signal<number | null>(null);
  addingToCartId = signal<number | null>(null);
  isClearing = signal(false);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        if (res.success) this.items.set(res.data ?? []);
        console.log(res.data);

        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load wishlist. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  removeItem(productId: number): void {
    this.removingId.set(productId);
    this.wishlistService.toggle(productId).subscribe({
      next: () => {
        this.items.update((list) => list.filter((i) => i.id !== productId));
        this.removingId.set(null);
        this.showSuccess('Item removed from wishlist.');
      },
      error: () => {
        this.error.set('Failed to remove item.');
        this.removingId.set(null);
      },
    });
  }

  addToCart(item: WishlistItem): void {
    this.addingToCartId.set(item.id);
    this.cartService.addItem(item.id, 1).subscribe({
      next: (res) => {
        if (res.success) this.showSuccess(`"${item.name}" added to cart!`);
        this.addingToCartId.set(null);
      },
      error: () => {
        this.error.set('Failed to add to cart.');
        this.addingToCartId.set(null);
      },
    });
  }

  clearWishlist(): void {
    if (!confirm('Clear your entire wishlist?')) return;
    this.isClearing.set(true);
    this.wishlistService.clear().subscribe({
      next: () => {
        this.items.set([]);
        this.isClearing.set(false);
        this.showSuccess('Wishlist cleared.');
      },
      error: () => {
        this.error.set('Failed to clear wishlist.');
        this.isClearing.set(false);
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
