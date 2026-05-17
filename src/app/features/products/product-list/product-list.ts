import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, ProductFilters } from '../../../interfaces/product.interface';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  totalPages = signal(1);
  totalCount = signal(0);

  filters: ProductFilters = {
    page: 1,
    pageSize: 9,
    search: '',
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    ascending: false,
  };

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      this.filters.search = params['Search'] || '';
      this.filters.categoryId = params['CategoryId'] ? +params['CategoryId'] : undefined;
      this.loadProducts();
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data),
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getAll(this.filters).subscribe({
      next: (res) => {
        this.products.set(res.data.items);
        this.totalPages.set(res.data.totalPages);
        this.totalCount.set(res.data.totalCount);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSearch(value: string) {
    this.filters.search = value;
    this.filters.page = 1;
    this.loadProducts();
  }

  onCategoryChange(id: number | undefined) {
    this.filters.categoryId = id;
    this.filters.page = 1;
    this.loadProducts();
  }

  onSortChange(sortBy: string) {
    this.filters.sortBy = sortBy;
    this.filters.page = 1;
    this.loadProducts();
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadProducts();
  }

  resetFilters() {
    this.filters = { page: 1, pageSize: 9, search: '', sortBy: 'createdAt', ascending: false };
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.filters.page = page;
    this.loadProducts();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  isFullStar(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }
}
