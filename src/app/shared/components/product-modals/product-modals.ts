import { Component, inject, signal, effect, input, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductModalService } from '../../../services/Product modal.service';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../interfaces/product.interface';
import { CategoryService } from '../../../services/category.service';


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
  private categorySvc = inject(CategoryService);
  private notif = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  categoryImageFile: File | null = null;


  isSubmitting = signal(false);
  newStock = 0;

  addForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, images: [] as File[] };
  editForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0 };

  categoryForm = { name: '', imageUrl: '', parentId: undefined as number | undefined };


  adminCat = input<any>();

  constructor() {
    effect(() => {
      const modal = this.modalSvc.activeModal();
      const product = this.modalSvc.selectedProduct();
      const category = this.modalSvc.selectedCategory();
      if (modal === 'edit' && product) {
        this.editForm = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        };
      }

      if (modal === 'category-add') {
        this.categoryForm = { name: '', imageUrl: '', parentId: undefined };
        this.categoryImageFile = null;
        this.cdr.detectChanges();
      }

      if (modal === 'category-edit' && category) {
        this.categoryForm = {
          name: category.name,
          imageUrl: category.imageUrl ?? '',
          parentId: category.parentId ?? undefined,
        };
        this.categoryImageFile = null;
        this.cdr.detectChanges();
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


  openAdd() { this.modalSvc.open('add'); }
  openEdit(product: Product) { this.modalSvc.open('edit', product); }
  openStock(product: Product) { this.modalSvc.open('stock', product); }
  deleteProduct(product: Product) {
    this.modalSvc.open('delete', product);
  }

  get categoryAdmin() {
    return this.adminCat();
  }


  saveCategory() {
    if (!this.categoryForm.name.trim()) {
      this.notif.error('Validation Error', 'Category name is required');
      return;
    }

    this.isSubmitting.set(true);

    const fd = new FormData();
    fd.append('Name', this.categoryForm.name.trim());

    if (this.categoryForm.parentId != null) {
      fd.append('ParentId', this.categoryForm.parentId.toString());
    }

    if (this.categoryImageFile) {
      fd.append('Image', this.categoryImageFile);
    }

    const selected = this.modalSvc.selectedCategory();
    const req = selected
      ? this.categorySvc.update(selected.id, fd)
      : this.categorySvc.create(fd);

    req.subscribe({
      next: () => {
        this.notif.success(
          selected ? 'Category updated' : 'Category created',
          'Changes saved successfully'
        );
        this.categoryImageFile = null;  // ← reset
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDeleteCategory() {
    const cat = this.modalSvc.selectedCategory();
    if (!cat) return;
    this.isSubmitting.set(true);
    this.categorySvc.delete(cat.id).subscribe({
      next: () => {
        this.notif.success('Deleted', 'Category removed successfully');
        this.modalSvc.close();
        this.isSubmitting.set(false);
        window.dispatchEvent(new CustomEvent('products:refresh'));
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      }
    });
  }

  onCategoryImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.categoryImageFile = file ?? null;
  }

  getCategoryPreview(): string {
    if (!this.categoryImageFile) return '';
    return URL.createObjectURL(this.categoryImageFile);
  }
  get parentOptions() {
    return this.modalSvc.categories().filter(
      (c) => !c.parentId && c.id !== this.modalSvc.editingCategoryId()
    );
  }
}
