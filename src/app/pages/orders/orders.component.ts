import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { OrderService } from '../../services/order.service';
import { InvoiceService } from '../../services/invoice.service';
import { NotificationService } from '../../services/notification.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orderSvc = inject(OrderService);
  invoiceSvc = inject(InvoiceService);
  notify = inject(NotificationService);
  productSvc = inject(ProductService);

  orders: Order[] = [];
  loading = false;
  activeFilter = 'All';
  filters = ['All', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    this.loading = true;
    this.orderSvc.getOrders().subscribe({ next: o => { setTimeout(() => { this.orders = o; this.loading = false; }); }, error: () => setTimeout(() => { this.loading = false; }) });
  }

  get filteredOrders(): Order[] {
    if (this.activeFilter === 'All') return this.orders;
    return this.orders.filter(o => o.orderStatus === this.activeFilter);
  }

  downloadInvoice(orderId: number): void {
    this.invoiceSvc.downloadInvoice(orderId).subscribe({
      next: blob => { this.invoiceSvc.triggerDownload(blob, orderId); this.notify.success('Invoice downloaded'); },
      error: () => {}
    });
  }

  getStatusClass(status: string): string {
    return `status-${(status || '').toLowerCase()}`;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getImageUrl(url?: string): string {
    return this.productSvc.getImageUrl(url || '');
  }
}
