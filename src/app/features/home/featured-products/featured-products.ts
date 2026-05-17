import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts {
  @Input() products: Product[] = [];

 // dummy data
  // products = [
  //   {
  //     id: 1,
  //     name: 'iPhone 15 Pro',
  //     price: 999,
  //     oldPrice: 1099,
  //     rating: 4.4,
  //     reviews: 248,
  //     seller: 'TechZone',
  //     category: 'electronics',
  //     badge: 'Hot',
  //   },
  //   {
  //     id: 2,
  //     name: 'AirPods Pro',
  //     price: 249,
  //     oldPrice: null,
  //     rating: 4.6,
  //     reviews: 312,
  //     seller: 'TechZone',
  //     category: 'electronics',
  //     badge: null,
  //   },
  //   {
  //     id: 3,
  //     name: 'MacBook Air',
  //     price: 1199,
  //     oldPrice: 1399,
  //     rating: 4.8,
  //     reviews: 189,
  //     seller: 'MegaMart',
  //     category: 'electronics',
  //     badge: 'Sale',
  //   },
  //   {
  //     id: 4,
  //     name: 'Nike Hoodie',
  //     price: 89,
  //     oldPrice: null,
  //     rating: 4.2,
  //     reviews: 94,
  //     seller: 'FashionHub',
  //     category: 'fashion',
  //     badge: null,
  //   },
  //   {
  //     id: 5,
  //     name: 'Apple Watch S9',
  //     price: 399,
  //     oldPrice: 449,
  //     rating: 4.5,
  //     reviews: 321,
  //     seller: 'TechZone',
  //     category: 'electronics',
  //     badge: 'Sale',
  //   },
  //   {
  //     id: 6,
  //     name: 'Sony A7 IV',
  //     price: 2499,
  //     oldPrice: null,
  //     rating: 4.9,
  //     reviews: 67,
  //     seller: 'GadgetHub',
  //     category: 'electronics',
  //     badge: 'New',
  //   },
  // ];

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  isFullStar(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }
}
