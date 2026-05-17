import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatIcon } from '../../../shared/components/category-icons';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [RouterLink, CatIcon],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection implements OnInit {
  private catSvc = inject(CategoryService);
  categories = signal<Category[]>([]);

  colorMap: Record<string, string> = {
    electronics: '#4f9cf9',
    smartphones: '#4f9cf9',
    laptops: '#4f9cf9',
    fashion: '#f97bbb',
    tops: '#f97bbb',
    'mens-shirts': '#f97bbb',
    home: '#c8a96e',
    furniture: '#c8a96e',
    'home-decoration': '#c8a96e',
    beauty: '#a78bfa',
    'skin-care': '#a78bfa',
    fragrances: '#a78bfa',
    sports: '#34d399',
    'sports-accessories': '#34d399',
  };

  getColor(name: string): string {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    return this.colorMap[key] ?? '#c8a96e';
  }

  getIconKey(name: string): string {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    const map: Record<string, string> = {
      electronics: 'electronics',
      smartphones: 'smartphones',
      laptops: 'laptops',
      tablets: 'tablets',
      fashion: 'fashion',
      tops: 'fashion',
      'mens-shirts': 'fashion',
      'womens-dresses': 'fashion',
      'home-decoration': 'home',
      furniture: 'furniture',
      'kitchen-accessories': 'groceries',
      groceries: 'groceries',
      beauty: 'beauty',
      'skin-care': 'skin-care',
      fragrances: 'fragrances',
      'sports-accessories': 'sports',
      sunglasses: 'sunglasses',
      motorcycle: 'motorcycle',
      vehicle: 'vehicle',
    };
    return map[key] ?? 'home';
  }

  ngOnInit() {
    this.catSvc.getAll().subscribe({
      next: (res) => this.categories.set(res.data.slice(0, 5)),
    });
  }
}
