import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category.interface';
import { CatIcon } from '../../../shared/components/category-icons';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [RouterLink, CatIcon],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
  private catSvc = inject(CategoryService);
  categories = signal<Category[]>([]);
  isLoading = signal(true);

  colorMap: Record<string, { color: string; iconKey: string }> = {
    electronics: { color: '#4f9cf9', iconKey: 'electronics' },
    fashion: { color: '#f97bbb', iconKey: 'fashion' },
    home: { color: '#c8a96e', iconKey: 'home' },
    beauty: { color: '#a78bfa', iconKey: 'beauty' },
    sports: { color: '#34d399', iconKey: 'sports' },
  };

  getStyle(name: string): { color: string; iconKey: string } {
    const key = name.toLowerCase().split(' ')[0];
    return this.colorMap[key] ?? { color: '#c8a96e', iconKey: 'home' };
  }

  ngOnInit() {
    this.catSvc.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
