import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export interface RecentOrder {
  id: number;
  customer: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.apiUrl);
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.http.get<RecentOrder[]>(`${this.apiUrl}/recent-orders`);
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`);
  }

  getMonthlyRevenue(): Observable<MonthlyRevenue[]> {
    return this.http.get<MonthlyRevenue[]>(`${this.apiUrl}/monthly-revenue`);
  }

  getOrderStatus(): Observable<OrderStatusCount[]> {
    return this.http.get<OrderStatusCount[]>(`${this.apiUrl}/order-status`);
  }
}
