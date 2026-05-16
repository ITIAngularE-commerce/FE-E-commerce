import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/wishlist.interface';
import { Order, UpdateOrderStatusRequest } from '../../interfaces/order.interface';
import { AdminStats, AdminUser } from '../../interfaces/admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private adminUrl = `${environment.apiUrl}/admin`;
  private ordersUrl = `${environment.apiUrl}/orders`;

  /** GET /api/v1/admin/stats */
  getStats(): Observable<ApiResponse<AdminStats>> {
    return this.http.get<ApiResponse<AdminStats>>(`${this.adminUrl}/stats`);
  }

  /** GET /api/v1/admin/users?role=... */
  getUsers(role?: string): Observable<ApiResponse<AdminUser[]>> {
    const params: Record<string, string> = {};
    if (role && role !== 'All') params['role'] = role;
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.adminUrl}/users`, { params });
  }

  /** PATCH /api/v1/admin/users/:id/toggle */
  toggleUser(id: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.adminUrl}/users/${id}/toggle`, {});
  }

  /** GET /api/v1/orders/admin/all */
  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.ordersUrl}/admin/all`);
  }

  /** PATCH /api/v1/orders/:id/status */
  updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.ordersUrl}/${id}/status`, payload);
  }

}
