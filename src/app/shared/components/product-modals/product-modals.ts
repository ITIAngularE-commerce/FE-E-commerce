import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductModalService } from '../../../services/Product modal.service';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-product-modals',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-modals.html',
  styleUrl: './product-modals.css',
})
export class ProductModals {
  modalSvc = inject(ProductModalService);
  private productSvc = inject(ProductService);
  private notif = inject(NotificationService);

  isSubmitting = signal(false);
  newStock = 0;

  addForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, images: [] as File[] };
  editForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0 };

  constructor() {
    // عند فتح edit أو stock، نملأ الفورم تلقائياً
    effect(() => {
      const modal = this.modalSvc.activeModal();
      const product = this.modalSvc.selectedProduct();
      if (modal === 'edit' && product) {
        this.editForm = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        };
      }
      if (modal === 'stock' && product) {
        this.newStock = product.stock;
      }
      if (modal === 'add') {
        this.addForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, images: [] };
      }
    });
  }

  onImagesChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.addForm.images = Array.from(files);
  }

  submitAdd() {
    if (!this.addForm.name || !this.addForm.categoryId || !this.addForm.images.length) {
      this.notif.error(
        'Missing fields',
        'Please fill all required fields and add at least one image',
      );
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
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  submitEdit() {
    const product = this.modalSvc.selectedProduct();
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
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  submitStock() {
    const product = this.modalSvc.selectedProduct();
    if (!product) return;
    this.isSubmitting.set(true);
    this.productSvc.updateStock(product.id, { stock: this.newStock }).subscribe({
      next: () => {
        this.notif.success('Stock updated!', `Stock set to ${this.newStock}`);
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  submitDelete() {
    const product = this.modalSvc.selectedProduct();
    if (!product) return;
    this.isSubmitting.set(true);
    this.productSvc.delete(product.id).subscribe({
      next: () => {
        this.notif.success('Deleted', 'Product removed successfully');
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }
}
