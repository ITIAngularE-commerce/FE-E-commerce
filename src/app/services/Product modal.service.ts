import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Category } from '../interfaces/category.interface';

// export type ModalType = 'add' | 'edit' | 'stock' | 'delete' | null;
export type ModalType =
  | 'add'
  | 'edit'
  | 'stock'
  | 'delete'
  | 'category-add'
  | 'category-edit'
  | 'category-delete'
  | null;

@Injectable({ providedIn: 'root' })
export class ProductModalService {
  activeModal = signal<ModalType>(null);
  selectedProduct = signal<Product | null>(null);
  selectedCategory = signal<Category | null>(null);
  categories = signal<Category[]>([]);
  editingCategoryId = signal<number | null>(null);


  // open(type: ModalType, product?: Product) {
  //   this.selectedProduct.set(product ?? null);
  //   this.activeModal.set(type);
  // }

  open(
    type: ModalType,
    data?: Product | Category
  ) {

    if (
      type?.startsWith('category')
    ) {
      this.selectedCategory.set(data as Category ?? null);
      this.selectedProduct.set(null);
    } else {
      this.selectedProduct.set(data as Product ?? null);
      this.selectedCategory.set(null);
    }

    this.activeModal.set(type);
  }

  close() {
    this.activeModal.set(null);
    this.selectedProduct.set(null);
    this.selectedCategory.set(null);
  }

  setCategories(cats: Category[]) {
    this.categories.set(cats);
  }
}
