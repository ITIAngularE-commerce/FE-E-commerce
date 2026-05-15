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

  // ─── Shared reactive state ────────────────────────────────────────────────
  // Any component / navbar that injects this service reads the SAME signal.
  // When saveProfile() resolves, every consumer updates automatically — no
  // refresh needed.
  readonly profile = signal<UserProfile | null>(null);
  readonly isLoadingProfile = signal(false);

  // ─── Profile ─────────────────────────────────────────────────────────────

  /** Fetches from API and writes result into the shared signal. */
  getProfile(): Observable<ApiResponse<UserProfile>> {
    this.isLoadingProfile.set(true);
    return this.http
      .get<ApiResponse<UserProfile>>(`${this.baseUrl}/profile`)
      .pipe(
        tap((res) => {
          if (res.success) this.profile.set(res.data);
          this.isLoadingProfile.set(false);
        })
      );
  }

  /**
   * PUTs the updated fields, then immediately patches the shared signal with
   * whatever the API returns — no second GET needed.
   */
  updateProfile(
    data: Partial<UserProfile>
  ): Observable<ApiResponse<UserProfile>> {
    return this.http
      .put<ApiResponse<UserProfile>>(`${this.baseUrl}/profile`, data)
      .pipe(
        tap((res) => {
          if (res.success) {
            // Merge the updated fields into the existing profile so nothing
            // gets lost (e.g. createdAt, role, id stay intact).
            this.profile.update((current) =>
              current ? { ...current, ...res.data } : res.data
            );
          }
        })
      );
  }

  // ─── Addresses ───────────────────────────────────────────────────────────

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(
      `${this.baseUrl}/addresses`
    );
  }

  addAddress(
    address: Omit<Address, 'id'>
  ): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(
      `${this.baseUrl}/addresses`,
      address
    );
  }

  updateAddress(
    addressId: string,
    address: Partial<Address>
  ): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(
      `${this.baseUrl}/addresses/${addressId}`,
      address
    );
  }

  deleteAddress(addressId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}/addresses/${addressId}`
    );
  }

  setDefaultAddress(
    addressId: string
  ): Observable<ApiResponse<Address>> {
    return this.http.patch<ApiResponse<Address>>(
      `${this.baseUrl}/addresses/${addressId}/default`,
      {}
    );
  }
}