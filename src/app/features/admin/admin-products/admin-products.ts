import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';
import { ProductModalService } from '../../../services/Product modal.service';
import { CategoryService } from '../../../services/category.service';
import { ProductModals } from '../../../shared/components/product-modals/product-modals';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductModals],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  modalSvc = inject(ProductModalService);

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
    this.categoryService.getAll().subscribe({
      next: (res) => { if (res.success) this.modalSvc.setCategories(res.data ?? []); }
    });

    this.loadProducts();

    window.addEventListener('products:refresh', () => this.loadProducts());
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) this.products.set(res.data.items ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  deleteProduct(product: Product) {
    this.modalSvc.open('delete', product);
  }

  openAdd() { this.modalSvc.open('add'); }
  openEdit(product: Product) { this.modalSvc.open('edit', product); }
  openStock(product: Product) { this.modalSvc.open('stock', product); }

}
