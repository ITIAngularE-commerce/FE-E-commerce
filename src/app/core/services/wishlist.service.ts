import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse, WishlistItem } from '../../interfaces/wishlist.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/wishlist`;

  // Global count signal — used by navbar heart icon
  wishlistCount = signal<number>(0);

  /** GET /api/v1/wishlist */
  getWishlist(): Observable<ApiResponse<WishlistItem[]>> {
    return this.http.get<ApiResponse<WishlistItem[]>>(this.baseUrl);
  }

  /** GET /api/v1/wishlist/count */
  getCount(): Observable<ApiResponse<number>> {
    return this.http
      .get<ApiResponse<number>>(`${this.baseUrl}/count`)
      .pipe(tap((res) => { if (res.success) this.wishlistCount.set(res.data); }));
  }

  /** POST /api/v1/wishlist/toggle/:productId */
  toggle(productId: number): Observable<ApiResponse<boolean>> {
    return this.http
      .post<ApiResponse<boolean>>(`${this.baseUrl}/toggle/${productId}`, {})
      .pipe(
        tap(() => {
          // refresh count after every toggle
          this.getCount().subscribe();
        })
      );
  }

  /** GET /api/v1/wishlist/check/:productId */
  check(productId: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/check/${productId}`);
  }

  /** DELETE /api/v1/wishlist/clear */
  clear(): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/clear`)
      .pipe(tap(() => this.wishlistCount.set(0)));
  }
}
