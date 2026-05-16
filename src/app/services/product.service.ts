import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedData } from '../interfaces/api-response.interface';
import { Product, ProductFilters, UpdateStockRequest } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/products`;

  getAll(filters?: ProductFilters) {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key.charAt(0).toUpperCase() + key.slice(1), val.toString());
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedData<Product>>>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Product>>(`${this.url}/${id}`);
  }

  getBySeller(sellerId: string) {
    return this.http.get<ApiResponse<PaginatedData<Product>>>(`${this.url}/seller/${sellerId}`);
  }

  create(formData: FormData) {
    return this.http.post<ApiResponse<Product>>(this.url, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put<ApiResponse<Product>>(`${this.url}/${id}`, formData);
  }

  updateStock(id: number, data: UpdateStockRequest) {
    return this.http.patch<ApiResponse<Product>>(`${this.url}/${id}/stock`, data);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`);
  }
}
