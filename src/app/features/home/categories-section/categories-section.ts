import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatIcon } from "../../../shared/components/category-icons";

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [RouterLink, CatIcon],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection {
  // categories = [
  //   {
  //     name: 'Electronics',
  //     count: '2.4k products',
  //     color: '#4f9cf9',
  //     route: '/products/electronics',
  //     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  //       <rect x="5" y="2" width="14" height="20" rx="2"/>
  //       <line x1="12" y1="18" x2="12.01" y2="18"/>
  //     </svg>`,
  //   },
  //   {
  //     name: 'Fashion',
  //     count: '5.1k products',
  //     color: '#f97bbb',
  //     route: '/products/fashion',
  //     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  //       <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  //     </svg>`,
  //   },
  //   {
  //     name: 'Home & Living',
  //     count: '3.8k products',
  //     color: '#c8a96e',
  //     route: '/products/home',
  //     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  //       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  //       <polyline points="9 22 9 12 15 12 15 22"/>
  //     </svg>`,
  //   },
  //   {
  //     name: 'Beauty',
  //     count: '1.9k products',
  //     color: '#a78bfa',
  //     route: '/products/beauty',
  //     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  //       <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
  //     </svg>`,
  //   },
  //   {
  //     name: 'Sports',
  //     count: '2.2k products',
  //     color: '#34d399',
  //     route: '/products/sports',
  //     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  //       <circle cx="12" cy="12" r="10"/>
  //       <path d="M4.93 4.93c4.08 4.08 10.05 5.27 15.07 3.07M4.93 19.07c4.08-4.08 5.27-10.05 3.07-15.07M19.07 19.07c-4.08-4.08-10.05-5.27-15.07-3.07"/>
  //     </svg>`,
  //   },
  // ];


categories = [
  { name: 'Electronics', iconKey: 'electronics', count: '2.4k products', color: '#4f9cf9', route: '/products/electronics' },
  { name: 'Fashion',     iconKey: 'fashion',     count: '5.1k products', color: '#f97bbb', route: '/products/fashion' },
  { name: 'Home & Living', iconKey: 'home',      count: '3.8k products', color: '#c8a96e', route: '/products/home' },
  { name: 'Beauty',      iconKey: 'beauty',      count: '1.9k products', color: '#a78bfa', route: '/products/beauty' },
  { name: 'Sports',      iconKey: 'sports',      count: '2.2k products', color: '#34d399', route: '/products/sports' },
];}
