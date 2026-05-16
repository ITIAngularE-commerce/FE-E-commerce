import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../interfaces/product.interface';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);
  private authService = inject(AuthService);
  private notif = inject(NotificationService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);

  // Modals
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  isSubmitting = signal(false);

  selectedProduct = signal<Product | null>(null);

  // Forms
  addForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    images: [] as File[],
  };

  editForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
  };

  newStock = 0;
  showStockModal = signal(false);

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    const sellerId = this.authService.currentUser()?.userId;
    if (!sellerId) return;
    this.isLoading.set(true);
    this.productSvc.getBySeller(sellerId).subscribe({
      next: (res) => {
        const data = Array.isArray(res.data) ? res.data : ((res.data as any).items ?? []);
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadCategories() {
    this.categorySvc.getAll().subscribe({
      next: (res) => this.categories.set(res.data),
    });
  }

  // ── Add ──
  openAdd() {
    this.addForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, images: [] };
    this.showAddModal.set(true);
  }

  onImagesChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.addForm.images = Array.from(files);
  }

  submitAdd() {
    if (!this.addForm.name || !this.addForm.categoryId || !this.addForm.images.length) {
      this.notif.error('Missing fields', 'Please fill all fields and add at least one image');
      return;
    }
    this.isSubmitting.set(true);
    const fd = new FormData();
    fd.append('Name', this.addForm.name);
    fd.append('Description', this.addForm.description);
    fd.append('Price', this.addForm.price.toString());
    fd.append('Stock', this.addForm.stock.toString());
    fd.append('CategoryId', this.addForm.categoryId.toString());
    this.addForm.images.forEach((img) => fd.append('Images', img));

    this.productSvc.create(fd).subscribe({
      next: () => {
        this.notif.success('Product added!', 'Your product is now live');
        this.showAddModal.set(false);
        this.loadProducts();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  // ── Edit ──
  openEdit(product: Product) {
    this.selectedProduct.set(product);
    this.editForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    };
    this.showEditModal.set(true);
  }

  submitEdit() {
    const product = this.selectedProduct();
    if (!product) return;
    this.isSubmitting.set(true);
    const fd = new FormData();
    fd.append('Name', this.editForm.name);
    fd.append('Description', this.editForm.description);
    fd.append('Price', this.editForm.price.toString());
    fd.append('Stock', this.editForm.stock.toString());
    fd.append('CategoryId', this.editForm.categoryId.toString());

    this.productSvc.update(product.id, fd).subscribe({
      next: () => {
        this.notif.success('Updated!', 'Product updated successfully');
        this.showEditModal.set(false);
        this.loadProducts();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  // ── Delete ──
  openDelete(product: Product) {
    this.selectedProduct.set(product);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const product = this.selectedProduct();
    if (!product) return;
    this.isSubmitting.set(true);
    this.productSvc.delete(product.id).subscribe({
      next: () => {
        this.notif.success('Deleted', 'Product removed successfully');
        this.showDeleteModal.set(false);
        this.loadProducts();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  // ── Stock ──
  openStock(product: Product) {
    this.selectedProduct.set(product);
    this.newStock = product.stock;
    this.showStockModal.set(true);
  }

  submitStock() {
    const product = this.selectedProduct();
    if (!product) return;
    this.isSubmitting.set(true);
    this.productSvc.updateStock(product.id, { stock: this.newStock }).subscribe({
      next: () => {
        this.notif.success('Stock updated!', `Stock set to ${this.newStock}`);
        this.showStockModal.set(false);
        this.loadProducts();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  closeAll() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.showStockModal.set(false);
  }
}
