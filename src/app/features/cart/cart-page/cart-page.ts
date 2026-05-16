import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { Cart, CartItem } from '../../../interfaces/cart.interface';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = signal<Cart | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  updatingItemId = signal<number | null>(null);
  isClearing = signal(false);

  itemCount = computed(() => this.cart()?.items?.length ?? 0);
  subtotal = computed(() =>
    this.cart()?.items?.reduce((sum, i) => sum + i.subtotal, 0) ?? 0
  );
  shipping = computed(() => (this.subtotal() >= 50 ? 0 : 5.99));
  total = computed(() => this.subtotal() + this.shipping());
  isEmpty = computed(() => this.itemCount() === 0);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.success) this.cart.set(res.data);
        this.isLoading.set(false);
        console.log(res.data);

      },
      error: () => {
        this.error.set('Failed to load cart. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  updateQuantity(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      this.removeItem(item.id);
      return;
    }
    this.updatingItemId.set(item.id);
    this.cartService.updateItem(item.id, newQty).subscribe({
      next: (res) => {
        if (res.success) this.cart.set(res.data);
        this.updatingItemId.set(null);
      },
      error: () => {
        this.showError('Failed to update quantity.');
        this.updatingItemId.set(null);
      },
    });
  }

  removeItem(itemId: number): void {
    this.updatingItemId.set(itemId);
    this.cartService.removeItem(itemId).subscribe({
      next: (res) => {
        if (res.success) this.cart.set(res.data);
        this.updatingItemId.set(null);
        this.showSuccess('Item removed from cart.');
      },
      error: () => {
        this.showError('Failed to remove item.');
        this.updatingItemId.set(null);
      },
    });
  }

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    this.isClearing.set(true);
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set({ id: this.cart()?.id ?? 0, items: [], total: 0 });
        this.isClearing.set(false);
        this.showSuccess('Cart cleared.');
      },
      error: () => {
        this.showError('Failed to clear cart.');
        this.isClearing.set(false);
      },
    });
  }

  goShopping(): void {
    this.router.navigate(['/']);
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  private showError(msg: string): void {
    this.error.set(msg);
    setTimeout(() => this.error.set(null), 3000);
  }
}
