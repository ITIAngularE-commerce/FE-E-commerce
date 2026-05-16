import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse, Cart } from '../../interfaces/cart.interface';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cart`;

  cartCount = signal<number>(0);

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.baseUrl);
  }

  getCartCount(): Observable<ApiResponse<number>> {
    return this.http
      .get<ApiResponse<number>>(`${this.baseUrl}/count`)
      .pipe(tap((res) => { if (res.success) this.cartCount.set(res.data); }));
  }

  addItem(productId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http
      .post<ApiResponse<Cart>>(`${this.baseUrl}/items`, { productId, quantity })
      .pipe(tap(() => this.getCartCount().subscribe())); // refresh
  }

  updateItem(cartItemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http
      .put<ApiResponse<Cart>>(`${this.baseUrl}/items/${cartItemId}`, { quantity })
      .pipe(tap(() => this.getCartCount().subscribe()));
  }

  removeItem(cartItemId: number): Observable<ApiResponse<Cart>> {
    return this.http
      .delete<ApiResponse<Cart>>(`${this.baseUrl}/items/${cartItemId}`)
      .pipe(tap(() => this.getCartCount().subscribe()));
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/clear`)
      .pipe(tap(() => this.cartCount.set(0)));
  }
}