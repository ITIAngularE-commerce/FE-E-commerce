import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Category } from '../interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/categories`;

  getAll() {
    return this.http.get<ApiResponse<Category[]>>(this.url);
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Category>>(`${this.url}/${id}`);
  }

  create(data: { name: string; imageUrl?: string; parentId?: number }) {
    return this.http.post<ApiResponse<Category>>(this.url, data);
  }

  update(id: number, data: { name: string; imageUrl?: string; parentId?: number }) {
    return this.http.put<ApiResponse<Category>>(`${this.url}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`);
  }
}
