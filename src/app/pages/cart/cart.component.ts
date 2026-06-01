import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CartService } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { NotificationService } from '../../services/notification.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, CartItemComponent, ConfirmationDialogComponent, LoaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartSvc = inject(CartService);
  couponSvc = inject(CouponService);
  notify = inject(NotificationService);
  router = inject(Router);

  cart: Cart | null = null;
  couponCode = '';
  discount = 0;
  couponApplied = false;
  couponLoading = false;
  removeDialogVisible = false;
  itemToRemove: number | null = null;
  loading = false;

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.loading = true;
    this.cartSvc.getCart().subscribe({ next: c => { this.cart = c; this.loading = false; }, error: () => this.loading = false });
  }

  onQuantityChanged(event: { cartItemId: number; quantity: number }): void {
    this.cartSvc.updateCart({ cartItemId: event.cartItemId, quantity: event.quantity }).subscribe({
      next: () => this.loadCart(), error: () => {}
    });
  }

  onRemove(cartItemId: number): void {
    this.itemToRemove = cartItemId;
    this.removeDialogVisible = true;
  }

  confirmRemove(): void {
    if (this.itemToRemove == null) return;
    this.cartSvc.removeFromCart(this.itemToRemove).subscribe({
      next: () => { this.notify.success('Item removed'); this.loadCart(); this.removeDialogVisible = false; this.itemToRemove = null; },
      error: () => {}
    });
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.couponLoading = true;
    this.couponSvc.validateCoupon({ code: this.couponCode, amount: this.cart?.totalAmount || 0 }).subscribe({
      next: res => {
        this.discount = res.discount;
        this.couponApplied = true;
        this.couponLoading = false;
        this.notify.success(`Coupon applied! You save ₹${res.discount}`);
      },
      error: (err) => { 
        this.couponLoading = false; 
        this.couponApplied = false; 
        this.discount = 0; 
        this.notify.error(err.error?.message || 'Invalid coupon code');
      }
    });
  }

  removeCoupon(): void {
    this.couponCode = '';
    this.discount = 0;
    this.couponApplied = false;
    this.notify.info('Coupon removed');
  }

  get finalAmount(): number { return (this.cart?.totalAmount || 0) - this.discount; }

  checkout(): void {
    if (!this.cart?.items.length) { this.notify.warning('Cart is empty'); return; }
    if (this.couponApplied && this.couponCode) {
      this.router.navigate(['/checkout'], { queryParams: { coupon: this.couponCode } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}
