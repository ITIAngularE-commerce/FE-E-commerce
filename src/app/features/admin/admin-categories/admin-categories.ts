import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../interfaces/category.interface';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductModalService } from '../../../services/Product modal.service';
import { ProductModals } from "../../../shared/components/product-modals/product-modals";

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ProductModals],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);
  modalSvc = inject(ProductModalService);
  private notif = inject(NotificationService);

  categories = signal<Category[]>([]);
  isLoading = signal(true);
  deletingId = signal<number | null>(null);
  editingId = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);
  expandedCategoryId = signal<number | null>(null);

  isSaving = signal(false);
  formError = signal<string | null>(null);
  // Only top-level categories as parent options (avoid circular)
  parentOptions = computed(() =>
    this.categories().filter((c) => !c.parentId && c.id !== this.editingId()),
  );

  ngOnInit() {
    this.load();
    window.addEventListener('products:refresh', () => this.load());
  }

  private load() {
    this.isLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.set(res.data ?? []);

          this.modalSvc.setCategories(this.categories());
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  // onParentChange(val: string) {
  //   this.form.parentId = val ? +val : undefined;
  // }

  parentName(parentId?: number): string {
    if (!parentId) return '—';
    return this.categories().find((c) => c.id === parentId)?.name ?? '—';
  }

  openAdd() {
    this.modalSvc.editingCategoryId.set(null);
    this.modalSvc.open('category-add');
  }

  openEdit(cat: Category) {
    this.modalSvc.editingCategoryId.set(cat.id);
    this.modalSvc.open('category-edit', cat);
  }

  deleteCategory(cat: Category) {
    this.modalSvc.open('category-delete', cat);
  }
  confirmDeleteCategory() {

    const cat = this.modalSvc.selectedCategory();

    if (!cat) return;

    this.isSaving.set(true);

    this.categoryService.delete(cat.id).subscribe({

      next: () => {

        this.notif.success(
          'Deleted',
          'Category removed successfully'
        );

        this.load();

        this.modalSvc.close();

        this.isSaving.set(false);
      },

      error: (err) => {

        this.notif.error(
          'Failed',
          err?.error?.message || 'Something went wrong'
        );

        this.isSaving.set(false);
      }
    });
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  toggleSubcategories(catId: number) {
    if (this.expandedCategoryId() === catId) {
      this.expandedCategoryId.set(null);
    } else {
      this.expandedCategoryId.set(catId);
    }
  }
}
