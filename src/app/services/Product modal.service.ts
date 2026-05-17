import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Category } from '../interfaces/category.interface';

export type ModalType = 'add' | 'edit' | 'stock' | 'delete' | null;

@Injectable({ providedIn: 'root' })
export class ProductModalService {
  activeModal = signal<ModalType>(null);
  selectedProduct = signal<Product | null>(null);
  categories = signal<Category[]>([]);

  open(type: ModalType, product?: Product) {
    this.selectedProduct.set(product ?? null);
    this.activeModal.set(type);
  }

  close() {
    this.activeModal.set(null);
    this.selectedProduct.set(null);
  }

  setCategories(cats: Category[]) {
    this.categories.set(cats);
  }
}
