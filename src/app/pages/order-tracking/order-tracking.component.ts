import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { OrderService } from '../../services/order.service';
import { TrackOrderResponse, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit {
  orderSvc = inject(OrderService);
  route = inject(ActivatedRoute);

  trackData: TrackOrderResponse | null = null;
  loading = false;

  statuses: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.orderSvc.trackOrder(id).subscribe({
      next: d => { this.trackData = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getStatusIndex(status: string): number {
    return this.statuses.indexOf(status as OrderStatus);
  }

  isCancelled(): boolean { return this.trackData?.orderStatus === 'Cancelled'; }
  isCompleted(status: OrderStatus): boolean { return !this.isCancelled() && this.getStatusIndex(this.trackData?.orderStatus || '') >= this.getStatusIndex(status); }
  isCurrent(status: OrderStatus): boolean { return this.trackData?.orderStatus === status; }

  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

  getStatusIcon(status: OrderStatus): string {
    const icons: Record<OrderStatus, string> = {
      'Placed': 'bi-check-circle', 'Confirmed': 'bi-bag-check', 'Packed': 'bi-box-seam',
      'Shipped': 'bi-truck', 'Delivered': 'bi-house-check', 'Cancelled': 'bi-x-circle'
    };
    return icons[status] || 'bi-circle';
  }
}
