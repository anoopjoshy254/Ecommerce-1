import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { CouponService } from '../../../services/coupon.service';
import { NotificationService } from '../../../services/notification.service';
import { Coupon } from '../../../models/coupon.model';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NavbarComponent, LoaderComponent, ConfirmationDialogComponent],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css'
})
export class CouponsComponent implements OnInit {
  couponSvc = inject(CouponService);
  notify = inject(NotificationService);
  fb = inject(FormBuilder);

  coupons: Coupon[] = [];
  loading = false;
  creating = false;
  showForm = false;
  
  deleteDialogVisible = false;
  couponToDelete: number | null = null;

  form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4)]],
    discountPercentage: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
    maxDiscount: [0, [Validators.required, Validators.min(1)]],
    minOrderValue: [0, [Validators.required, Validators.min(0)]],
    expiryDate: ['', Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading = true;
    this.couponSvc.getSellerCoupons().subscribe({
      next: c => { this.coupons = c; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.creating = true;
    this.couponSvc.createCoupon(this.form.value as any).subscribe({
      next: () => {
        this.creating = false;
        this.showForm = false;
        this.form.reset({ discountPercentage: 10, isActive: true });
        this.notify.success('Coupon created');
        this.loadCoupons();
      },
      error: () => this.creating = false
    });
  }

  confirmDelete(id: number): void {
    this.couponToDelete = id;
    this.deleteDialogVisible = true;
  }

  doDelete(): void {
    if (this.couponToDelete === null) return;
    this.couponSvc.deleteCoupon(this.couponToDelete).subscribe({
      next: () => {
        this.notify.success('Coupon deleted');
        this.loadCoupons();
        this.deleteDialogVisible = false;
        this.couponToDelete = null;
      }
    });
  }

  toggleActive(c: Coupon): void {
    this.couponSvc.updateCoupon(c.id, { isActive: !c.isActive }).subscribe({
      next: () => {
        c.isActive = !c.isActive;
        this.notify.success(`Coupon ${c.isActive ? 'activated' : 'deactivated'}`);
      }
    });
  }

  formatDate(d: string): string { return new Date(d).toLocaleDateString(); }
  isExpired(d: string): boolean { return new Date(d).getTime() < new Date().getTime(); }
}
