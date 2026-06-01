import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { DashboardService, DashboardSummary, RecentOrder, TopProduct } from '../../../services/dashboard.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dashSvc = inject(DashboardService);
  notify = inject(NotificationService);

  summary: DashboardSummary | null = null;
  recentOrders: RecentOrder[] = [];
  topProducts: TopProduct[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.dashSvc.getSummary().subscribe({ next: s => { this.summary = s; this.loading = false; }, error: () => this.loading = false });
    this.dashSvc.getRecentOrders().subscribe({ next: o => this.recentOrders = o, error: () => {} });
    this.dashSvc.getTopProducts().subscribe({ next: p => this.topProducts = p, error: () => {} });
  }

  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  getStatusClass(s: string): string { return `status-${s.toLowerCase()}`; }
}
