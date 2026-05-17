import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  deletingId = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);
  search = signal('');

  filteredProducts = computed(() => {
    const q = this.search().toLowerCase();
    return this.products().filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q),
    );
  });

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products.set(res.data.items ?? []);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    this.deletingId.set(product.id);
    this.productService.delete(product.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.products.update((list) => list.filter((p) => p.id !== product.id));
          this.showSuccess(`"${product.name}" deleted.`);
        }
        this.deletingId.set(null);
      },
      error: () => {
        this.error.set('Failed to delete product.');
        this.deletingId.set(null);
      },
    });
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
