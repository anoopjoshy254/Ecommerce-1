import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CouponService } from '../../services/coupon.service';
import { NotificationService } from '../../services/notification.service';
import { Cart } from '../../models/cart.model';
import { PaymentMethod } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartSvc = inject(CartService);
  orderSvc = inject(OrderService);
  couponSvc = inject(CouponService);
  notify = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  cart: Cart | null = null;
  loading = false;
  placing = false;
  selectedPayment: PaymentMethod = 'UPI';
  discount = 0;
  couponCode = '';
  couponApplied = false;

  savedAddress: any = null;
  useSavedAddress = false;

  paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

  form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cartSvc.getCart().subscribe({ next: c => { 
      setTimeout(() => { 
        this.cart = c; 
        if (!c.items.length) {
          this.router.navigate(['/cart']); 
        } else {
          this.route.queryParams.subscribe(params => {
            if (params['coupon'] && !this.couponApplied) {
              this.couponCode = params['coupon'];
              this.applyCoupon();
            }
          });
        }
      }); 
    } });

    const saved = localStorage.getItem('shopmart_saved_address');
    if (saved) {
      try {
        this.savedAddress = JSON.parse(saved);
        this.useSavedAddress = true;
        this.form.patchValue(this.savedAddress);
      } catch (e) {}
    }
  }

  get shippingAddress(): string {
    if (this.useSavedAddress && this.savedAddress) {
      const v = this.savedAddress;
      return `${v.address}, ${v.city}, ${v.state} - ${v.pincode}. Phone: ${v.phone}`;
    }
    const v = this.form.value;
    return `${v.address}, ${v.city}, ${v.state} - ${v.pincode}. Phone: ${v.phone}`;
  }

  get finalAmount(): number { return (this.cart?.totalAmount || 0) - this.discount; }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.couponSvc.validateCoupon({ code: this.couponCode, amount: this.cart?.totalAmount || 0 }).subscribe({
      next: res => { this.discount = res.discount; this.couponApplied = true; this.notify.success(`Saved ₹${res.discount}!`); },
      error: (err) => { 
        this.discount = 0; 
        this.couponApplied = false; 
        this.notify.error(err.error?.message || 'Invalid coupon code');
      }
    });
  }

  placeOrder(): void {
    if (!this.useSavedAddress && this.form.invalid) { this.form.markAllAsTouched(); this.notify.error('Please fill all address fields'); return; }
    this.placing = true;

    if (!this.useSavedAddress) {
      localStorage.setItem('shopmart_saved_address', JSON.stringify(this.form.value));
    }

    this.orderSvc.checkout({ shippingAddress: this.shippingAddress, paymentMethod: this.selectedPayment }).subscribe({
      next: res => {
        this.placing = false;
        this.cartSvc.resetCount();
        this.notify.info('Redirecting to payment gateway...');
        this.router.navigate(['/payment-gateway', res.orderId]);
      },
      error: (err) => { 
        this.placing = false; 
        this.notify.error(err.error?.message || 'Failed to place order. Please try again.');
      }
    });
  }
}
