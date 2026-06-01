import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SalesData {
  date: string;
  totalSales: number;
}

export interface ProductPerformance {
  productId: number;
  productName: string;
  unitsSold: number;
  revenueGenerated: number;
  views: number;
  conversionRate: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSalesData(period: string = 'month'): Observable<SalesData[]> {
    // Return mock data for the bar chart
    const mockData: SalesData[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      mockData.push({
        date: d.toISOString(),
        totalSales: Math.floor(Math.random() * 50000) + 10000
      });
    }
    return of(mockData);
  }

  getProductPerformance(): Observable<ProductPerformance[]> {
    return of([
      { productId: 1, productName: 'iPhone 15 Pro Max', unitsSold: 45, revenueGenerated: 6750000, views: 1200, conversionRate: 3.75 },
      { productId: 2, productName: 'Sony WH-1000XM5', unitsSold: 120, revenueGenerated: 4200000, views: 2500, conversionRate: 4.8 },
      { productId: 3, productName: 'MacBook Air M2', unitsSold: 30, revenueGenerated: 3450000, views: 800, conversionRate: 3.75 },
      { productId: 4, productName: 'Samsung Galaxy Watch 6', unitsSold: 210, revenueGenerated: 6300000, views: 5000, conversionRate: 4.2 },
    ]);
  }
}
