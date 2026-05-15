import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  Review,
  ProductRating,
  CreateReviewRequest,
  UpdateReviewRequest,
} from '../interfaces/review.interface';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reviews`;

  getByProduct(productId: number) {
    return this.http.get<ApiResponse<Review[]>>(`${this.url}/product/${productId}`);
  }

  getProductRating(productId: number) {
    return this.http.get<ApiResponse<ProductRating>>(`${this.url}/product/${productId}/rating`);
  }

  getMyReviews() {
    return this.http.get<ApiResponse<Review[]>>(`${this.url}/my-reviews`);
  }

  create(productId: number, data: CreateReviewRequest) {
    return this.http.post<ApiResponse<Review>>(`${this.url}/product/${productId}`, data);
  }

  update(reviewId: number, data: UpdateReviewRequest) {
    return this.http.put<ApiResponse<Review>>(`${this.url}/${reviewId}`, data);
  }

  delete(reviewId: number) {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${reviewId}`);
  }
}
