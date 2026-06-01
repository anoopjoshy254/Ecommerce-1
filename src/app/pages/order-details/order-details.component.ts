import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { OrderService } from '../../services/order.service';
import { InvoiceService } from '../../services/invoice.service';
import { NotificationService } from '../../services/notification.service';
import { Order, OrderDetails, OrderItem } from '../../models/order.model';
import { ReviewService } from '../../services/review.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  orderSvc = inject(OrderService);
  invoiceSvc = inject(InvoiceService);
  notify = inject(NotificationService);
  route = inject(ActivatedRoute);
  reviewSvc = inject(ReviewService);
  productSvc = inject(ProductService);

  orderDetails: OrderDetails | null = null;
  loading = false;

  // Review Modal State
  showReviewModal = false;
  reviewingItem: OrderItem | null = null;
  reviewRating = 5;
  reviewComment = '';
  submittingReview = false;

  get order(): Order | undefined { return this.orderDetails?.order; }
  get items(): OrderItem[] { return this.orderDetails?.items || []; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.orderSvc.getOrderById(id).subscribe({
      next: res => { this.orderDetails = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  downloadInvoice(): void {
    if (!this.order) return;
    this.invoiceSvc.downloadInvoice(this.order.id).subscribe({
      next: blob => { this.invoiceSvc.triggerDownload(blob, this.order!.id); this.notify.success('Invoice downloaded!'); }
    });
  }

  getStatusClass(status: string): string { return `status-${(status || '').toLowerCase()}`; }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  getImageUrl(url?: string): string { return this.productSvc.getImageUrl(url || ''); }

  openReviewModal(item: OrderItem): void {
    this.reviewingItem = item;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewingItem = null;
  }

  submitReview(): void {
    if (!this.reviewingItem || !this.reviewComment.trim()) return;
    
    this.submittingReview = true;
    this.reviewSvc.createReview({
      productId: this.reviewingItem.productId,
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: () => {
        this.submittingReview = false;
        this.closeReviewModal();
        this.notify.success('Review submitted successfully!');
      },
      error: (err) => {
        this.submittingReview = false;
        this.notify.error(err.error?.message || 'Failed to submit review');
      }
    });
  }
}
