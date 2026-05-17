// src/app/core/services/payment.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../interfaces/profile.interface';

export interface InitiatePaymentResponse {
    iframeUrl: string;
    paymentToken: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/payments`;

    initiatePayment(orderId: number): Observable<ApiResponse<InitiatePaymentResponse>> {
        return this.http.post<ApiResponse<InitiatePaymentResponse>>(`${this.baseUrl}/initiate/${orderId}`, {});
    }
}