import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Address, ApiResponse, UserProfile } from '../../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/user`;

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/profile`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.baseUrl}/profile`, data);
  }

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.baseUrl}/addresses`);
  }

  addAddress(address: Omit<Address, 'id'>): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(`${this.baseUrl}/addresses`, address);
  }

  updateAddress(addressId: string, address: Partial<Address>): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.baseUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(addressId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/addresses/${addressId}`);
  }

  setDefaultAddress(addressId: string): Observable<ApiResponse<Address>> {
    return this.http.patch<ApiResponse<Address>>(`${this.baseUrl}/addresses/${addressId}/default`, {});
  }
}