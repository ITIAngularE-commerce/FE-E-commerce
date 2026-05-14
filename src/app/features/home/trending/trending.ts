import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
})
export class Trending {
  products = [
    {
      id: 7,
      name: 'Nike Hoodie',
      price: 89,
      oldPrice: null,
      rating: 4.2,
      reviews: 94,
      seller: 'FashionHub',
      badge: null,
      hot: true,
    },
    {
      id: 8,
      name: 'Apple Watch S9',
      price: 399,
      oldPrice: 449,
      rating: 4.5,
      reviews: 321,
      seller: 'TechZone',
      badge: 'Sale',
      hot: false,
    },
    {
      id: 9,
      name: 'Sony A7 IV',
      price: 2499,
      oldPrice: null,
      rating: 4.9,
      reviews: 67,
      seller: 'GadgetHub',
      badge: 'New',
      hot: false,
    },
    {
      id: 10,
      name: "Levi's Jacket",
      price: 129,
      oldPrice: 159,
      rating: 4.3,
      reviews: 156,
      seller: 'FashionHub',
      badge: 'Sale',
      hot: false,
    },
    {
      id: 11,
      name: 'PS5 Console',
      price: 499,
      oldPrice: null,
      rating: 4.8,
      reviews: 432,
      seller: 'GadgetHub',
      badge: null,
      hot: true,
    },
    {
      id: 12,
      name: 'Dyson V15',
      price: 699,
      oldPrice: 799,
      rating: 4.7,
      reviews: 203,
      seller: 'MegaMart',
      badge: 'Sale',
      hot: false,
    },
  ];

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  isFullStar(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }
}
