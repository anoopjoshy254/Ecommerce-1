import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coupon, ValidateCouponRequest, ValidateCouponResponse, CreateCouponRequest } from '../models/coupon.model';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  getSellerCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  validateCoupon(request: ValidateCouponRequest): Observable<ValidateCouponResponse> {
    return this.http.post<ValidateCouponResponse>(`${this.apiUrl}/validate`, request);
  }

  createCoupon(request: CreateCouponRequest): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, request);
  }

  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCoupon(id: number, data: Partial<Coupon>): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, data);
  }
}
