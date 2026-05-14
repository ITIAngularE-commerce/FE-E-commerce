import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse, Cart } from '../../interfaces/cart.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cart`;

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.baseUrl);
  }

  getCartCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/count`);
  }

  addItem(productId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.baseUrl}/items`, { productId, quantity });
  }

  updateItem(cartItemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.baseUrl}/items/${cartItemId}`, { quantity });
  }

  removeItem(cartItemId: number): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.baseUrl}/items/${cartItemId}`);
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/clear`);
  }
}
