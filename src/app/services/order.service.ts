import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Order, SellerOrder, OrderDetails, CheckoutRequest, CheckoutResponse,
  TrackOrderResponse, UpdateOrderStatusRequest, VerifyPaymentRequest, VerifyPaymentResponse
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  checkout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, request);
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<VerifyPaymentResponse> {
    return this.http.post<VerifyPaymentResponse>(`${this.apiUrl}/verify-payment`, request);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.apiUrl}/${id}`);
  }

  trackOrder(id: number): Observable<TrackOrderResponse> {
    return this.http.get<TrackOrderResponse>(`${this.apiUrl}/track/${id}`);
  }

  getAllOrders(): Observable<SellerOrder[]> {
    return this.http.get<SellerOrder[]>(`${this.apiUrl}/all`);
  }

  getSellerOrderDetails(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.apiUrl}/seller/${id}`);
  }

  updateOrderStatus(id: number, request: UpdateOrderStatusRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/status/${id}`, request);
  }
}
