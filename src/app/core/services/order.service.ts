import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/profile.interface';
import { CreateOrderRequest, Order, UpdateOrderStatusRequest } from '../../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/orders`;

  /** GET /api/v1/orders — current user's orders */
  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.baseUrl);
  }

  /** GET /api/v1/orders/:id */
  getOrderById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`);
  }

  /** POST /api/v1/orders */
  createOrder(payload: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.baseUrl, payload);
  }

  /** POST /api/v1/orders/:id/cancel */
  cancelOrder(id: number): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/${id}/cancel`, {});
  }

  /** PATCH /api/v1/orders/:id/status  (admin) */
  updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}/status`, payload);
  }

  /** GET /api/v1/orders/admin/all  (admin) */
  getAllOrdersAdmin(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/admin/all`);
  }
}
