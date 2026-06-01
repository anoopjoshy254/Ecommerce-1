import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { OrderService } from '../../../services/order.service';
import { InvoiceService } from '../../../services/invoice.service';
import { NotificationService } from '../../../services/notification.service';
import { Order, OrderStatus, OrderDetails, OrderItem } from '../../../models/order.model';

@Component({
  selector: 'app-seller-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoaderComponent],
  templateUrl: './seller-order-details.component.html',
  styleUrl: './seller-order-details.component.css'
})
export class SellerOrderDetailsComponent implements OnInit {
  orderSvc = inject(OrderService);
  invoiceSvc = inject(InvoiceService);
  notify = inject(NotificationService);
  route = inject(ActivatedRoute);

  orderDetails: OrderDetails | null = null;
  loading = false;
  statuses: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  get order(): Order | undefined { return this.orderDetails?.order; }
  get items(): OrderItem[] { return this.orderDetails?.items || []; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.orderSvc.getSellerOrderDetails(id).subscribe({
      next: res => { this.orderDetails = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  updateStatus(status: OrderStatus): void {
    if (!this.order) return;
    this.orderSvc.updateOrderStatus(this.order.id, { orderStatus: status }).subscribe({
      next: () => {
        this.order!.orderStatus = status;
        this.notify.success('Order status updated successfully');
      }
    });
  }

  downloadInvoice(): void {
    if (!this.order) return;
    this.invoiceSvc.downloadInvoice(this.order.id).subscribe({
      next: blob => { this.invoiceSvc.triggerDownload(blob, this.order!.id); this.notify.success('Invoice generated'); }
    });
  }

  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  getStatusClass(s: string): string { return `status-${s.toLowerCase()}`; }
}
