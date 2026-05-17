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

    fragrances: { color: '#f472b6', iconKey: 'fragrances' },
    furniture: { color: '#f59e0b', iconKey: 'furniture' },
    groceries: { color: '#22c55e', iconKey: 'groceries' },

    laptops: { color: '#60a5fa', iconKey: 'laptops' },
    smartphones: { color: '#3b82f6', iconKey: 'smartphones' },
    tablets: { color: '#818cf8', iconKey: 'tablets' },

    sunglasses: { color: '#facc15', iconKey: 'sunglasses' },
    skincare: { color: '#ec4899', iconKey: 'skin-care' },
    'skin-care': { color: '#ec4899', iconKey: 'skin-care' },

    motorcycle: { color: '#ef4444', iconKey: 'motorcycle' },
    vehicle: { color: '#14b8a6', iconKey: 'vehicle' },
    automotive: { color: '#14b8a6', iconKey: 'vehicle' },
  };

  // getStyle(name: string): { color: string; iconKey: string } {
  //   const key = name.toLowerCase().split(' ')[0];
  //   return this.colorMap[key] ?? { color: '#c8a96e', iconKey: 'home' };
  // }

  getStyle(name: string): { color: string; iconKey: string } {
    const normalized = name.toLowerCase().trim();

    return (
      this.colorMap[normalized] ??
      this.colorMap[normalized.replace(/\s+/g, '-')] ?? {
        color: '#c8a96e',
        iconKey: 'electronics',
      }
    );
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
