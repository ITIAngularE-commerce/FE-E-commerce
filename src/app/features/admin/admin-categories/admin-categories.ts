import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../interfaces/category.interface';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  isLoading = signal(true);
  deletingId = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);

  // Modal
  showModal = signal(false);
  editingId = signal<number | null>(null);
  isSaving = signal(false);
  formError = signal<string | null>(null);
  form: { name: string; imageUrl: string; parentId?: number } = {
    name: '',
    imageUrl: '',
    parentId: undefined,
  };

  // Only top-level categories as parent options (avoid circular)
  parentOptions = computed(() =>
    this.categories().filter((c) => !c.parentId && c.id !== this.editingId()),
  );

  ngOnInit() {
    this.load();
  }

  private load() {
    this.isLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.categories.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onParentChange(val: string) {
    this.form.parentId = val ? +val : undefined;
  }

  parentName(parentId?: number): string {
    if (!parentId) return '—';
    return this.categories().find((c) => c.id === parentId)?.name ?? '—';
  }

  openAdd() {
    this.editingId.set(null);
    this.form = { name: '', imageUrl: '', parentId: undefined };
    this.formError.set(null);
    this.showModal.set(true);
  }

  openEdit(cat: Category) {
    this.editingId.set(cat.id);
    this.form = {
      name: cat.name,
      imageUrl: cat.imageUrl ?? '',
      parentId: cat.parentId ?? undefined,
    };
    this.formError.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  save() {
    if (!this.form.name.trim()) {
      this.formError.set('Name is required.');
      return;
    }
    this.isSaving.set(true);
    this.formError.set(null);
    const payload = {
      name: this.form.name.trim(),
      imageUrl: this.form.imageUrl.trim() || undefined,
      parentId: this.form.parentId,
    };
    const id = this.editingId();
    const req = id
      ? this.categoryService.update(id, payload)
      : this.categoryService.create(payload);

    req.subscribe({
      next: (res) => {
        if (res.success) {
          this.load();
          this.showSuccess(id ? 'Category updated.' : 'Category created.');
          this.closeModal();
        }
        this.isSaving.set(false);
      },
      error: () => {
        this.formError.set('Something went wrong. Please try again.');
        this.isSaving.set(false);
      },
    });
  }

  deleteCategory(cat: Category) {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    this.deletingId.set(cat.id);
    this.categoryService.delete(cat.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.update((list) => list.filter((c) => c.id !== cat.id));
          this.showSuccess(`"${cat.name}" deleted.`);
        }
        this.deletingId.set(null);
      },
      error: () => {
        this.error.set('Failed to delete category.');
        this.deletingId.set(null);
      },
    });
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
