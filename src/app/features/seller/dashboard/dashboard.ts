import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../interfaces/product.interface';
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private productSvc = inject(ProductService);
  authService = inject(AuthService);

  products = signal<Product[]>([]);
  isLoading = signal(true);

  stats = signal({
    totalProducts: 0,
    totalRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  ngOnInit() {
    const sellerId = this.authService.currentUser()?.userId;
    if (!sellerId) return;

    this.productSvc.getBySeller(sellerId).subscribe({
      next: (res) => {
        const prods = Array.isArray(res.data) ? res.data : ((res.data as any).items ?? []);
        this.products.set(prods);

        const totalRevenue = prods.reduce((sum: number, p: Product) => sum + p.price * p.stock, 0);
        const avgRating = prods.length
          ? prods.reduce((s: number, p: Product) => s + p.averageRating, 0) / prods.length
          : 0;
        const totalReviews = prods.reduce((s: number, p: Product) => s + p.reviewCount, 0);

        this.stats.set({
          totalProducts: prods.length,
          totalRevenue,
          avgRating: +avgRating.toFixed(1),
          totalReviews,
        });

        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }
  isFullStar(rating: number, i: number): boolean {
    return i < Math.floor(rating);
  }
}