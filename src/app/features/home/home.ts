import { Component, inject, OnInit, signal } from '@angular/core';
import { Hero } from './hero/hero';
import { CategoriesSection } from './categories-section/categories-section';
import { FeaturedProducts } from './featured-products/featured-products';
import { Trending } from './trending/trending';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, CategoriesSection, FeaturedProducts, Trending],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productSvc = inject(ProductService);

  featured = signal<Product[]>([]);
  trending = signal<Product[]>([]);

  ngOnInit() {
    // Featured ← highest rated
    this.productSvc
      .getAll({
        page: 1,
        pageSize: 6,
        sortBy: 'averageRating',
        ascending: false,
      })
      .subscribe({
        next: (res) => this.featured.set(res.data.items),
      });

    // Trending ← newest
    this.productSvc
      .getAll({
        page: 1,
        pageSize: 6,
        sortBy: 'createdAt',
        ascending: false,
      })
      .subscribe({
        next: (res) => this.trending.set(res.data.items),
      });
  }
}
