import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { AnalyticsService, SalesData, ProductPerformance } from '../../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoaderComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  analyticsSvc = inject(AnalyticsService);

  salesData: SalesData[] = [];
  productPerformance: ProductPerformance[] = [];
  loading = false;
  maxSalesValue = 0;

  ngOnInit(): void {
    this.loading = true;
    this.analyticsSvc.getSalesData('month').subscribe({
      next: data => {
        this.salesData = data;
        this.maxSalesValue = Math.max(...data.map(d => d.totalSales));
        this.analyticsSvc.getProductPerformance().subscribe({
          next: perf => { this.productPerformance = perf; this.loading = false; },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  getBarHeight(val: number): string {
    if (this.maxSalesValue === 0) return '0%';
    return `${(val / this.maxSalesValue) * 100}%`;
  }
}
