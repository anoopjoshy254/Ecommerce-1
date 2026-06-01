import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { DashboardService, RecentOrder } from '../../../services/dashboard.service';
import { OrderService } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';
import { OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoaderComponent],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent implements OnInit {
  dashSvc = inject(DashboardService);
  orderSvc = inject(OrderService);
  notify = inject(NotificationService);

  orders: RecentOrder[] = [];
  filteredOrders: RecentOrder[] = [];
  loading = false;
  activeFilter = 'All';
  searchQuery = '';
  
  filters = ['All', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.dashSvc.getRecentOrders().subscribe({
      next: o => { this.orders = o; this.applyFilters(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  applyFilters(): void {
    let result = this.orders;
    if (this.activeFilter !== 'All') {
      result = result.filter(o => o.orderStatus === this.activeFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o => o.id.toString().includes(q) || o.customer.toLowerCase().includes(q));
    }
    this.filteredOrders = result;
  }

  setFilter(f: string): void {
    this.activeFilter = f;
    this.applyFilters();
  }

  updateStatus(orderId: number, status: string): void {
    this.orderSvc.updateOrderStatus(orderId, { orderStatus: status as OrderStatus }).subscribe({
      next: () => {
        this.notify.success('Order status updated');
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.orderStatus = status;
        this.applyFilters();
      }
    });
  }

  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  getStatusClass(s: string): string { return `status-${s.toLowerCase()}`; }
}
