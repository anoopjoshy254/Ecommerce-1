import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';
import { OrderDetails } from '../../models/order.model';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderSvc = inject(OrderService);
  notify = inject(NotificationService);

  orderId!: number;
  orderDetails: OrderDetails | null = null;
  loading = true;
  
  upiId = '';
  processing = false;

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }

    this.orderSvc.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.orderDetails = res;
        this.loading = false;
        if (this.orderDetails.order.paymentStatus === 'Paid') {
          this.notify.info('This order is already paid');
          this.router.navigate(['/orders']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  processPayment() {
    if (!this.upiId || !this.orderDetails) return;
    
    // Basic validation for UPI ID (must contain @)
    if (!this.upiId.includes('@')) {
      this.notify.error('Invalid UPI ID. Must contain "@" (e.g., name@bank)');
      return;
    }
    
    this.processing = true;
    
    // Simulate payment delay
    setTimeout(() => {
      const mockTxnId = 'UPI' + Math.random().toString().slice(2, 12);
      
      this.orderSvc.verifyPayment({
        orderId: this.orderId,
        transactionId: mockTxnId
      }).subscribe({
        next: (res) => {
          this.notify.success('Payment successful!');
          this.router.navigate(['/order-success', this.orderId]);
        },
        error: (err) => {
          this.processing = false;
          this.notify.error('Payment failed. Please try again.');
        }
      });
    }, 2500); // 2.5 second simulated delay
  }
}
