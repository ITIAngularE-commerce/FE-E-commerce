// src/app/core/services/address.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../interfaces/profile.interface';

export interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export interface CreateAddressDto {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    isDefault: boolean;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/user/addresses`;

    getAddresses(): Observable<ApiResponse<Address[]>> {
        return this.http.get<ApiResponse<Address[]>>(this.baseUrl);
    }

    addAddress(dto: CreateAddressDto): Observable<ApiResponse<Address>> {
        return this.http.post<ApiResponse<Address>>(this.baseUrl, dto);
    }

    deleteAddress(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
    }

    setDefaultAddress(id: number): Observable<ApiResponse<Address>> {
        return this.http.patch<ApiResponse<Address>>(`${this.baseUrl}/${id}/default`, {});
    }
}