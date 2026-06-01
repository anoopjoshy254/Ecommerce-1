import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Review, RatingResponse } from '../../models/review.model';
import { WishlistItem } from '../../models/user.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent, StarRatingComponent, ReviewCardComponent, LoaderComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  productSvc = inject(ProductService);
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);
  reviewSvc = inject(ReviewService);
  authSvc = inject(AuthService);
  notify = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  product: Product | null = null;
  reviews: Review[] = [];
  ratingData: RatingResponse = { averageRating: 0, totalReviews: 0 };
  wishlistItem: WishlistItem | null = null;
  quantity = 1;
  loading = false;
  reviewLoading = false;
  selectedRating = 0;
  activeTab = 'description';

  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
    this.loadReviews(id);
    this.loadRating(id);
    if (this.authSvc.isLoggedIn()) {
      this.wishlistSvc.getWishlist().subscribe({ next: items => { this.wishlistItem = items.find(w => w.productId === id) || null; } });
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productSvc.getProductById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/products']); }
    });
  }

  loadReviews(id: number): void {
    this.reviewSvc.getReviews(id).subscribe({ next: r => this.reviews = r, error: () => {} });
  }

  loadRating(id: number): void {
    this.reviewSvc.getAverageRating(id).subscribe({ next: r => this.ratingData = r, error: () => {} });
  }

  getImageUrl(): string {
    return this.productSvc.getImageUrl(this.product?.imageUrl || '');
  }

  isWishlisted(): boolean { return !!this.wishlistItem; }

  toggleWishlist(): void {
    if (!this.authSvc.isLoggedIn()) { this.notify.warning('Please login'); this.router.navigate(['/login']); return; }
    if (this.wishlistItem) {
      this.wishlistSvc.removeWishlist(this.wishlistItem.wishlistId).subscribe({ next: () => { this.wishlistItem = null; this.notify.info('Removed from wishlist'); } });
    } else {
      this.wishlistSvc.addWishlist(this.product!.id).subscribe({ next: () => { this.notify.success('Added to wishlist!'); this.wishlistSvc.getWishlist().subscribe({ next: items => this.wishlistItem = items.find(w => w.productId === this.product!.id) || null }); } });
    }
  }

  addToCart(): void {
    if (!this.authSvc.isLoggedIn()) { this.notify.warning('Please login'); this.router.navigate(['/login']); return; }
    this.cartSvc.addToCart({ productId: this.product!.id, quantity: this.quantity }).subscribe({
      next: () => this.notify.success('Added to cart!'), error: () => {}
    });
  }

  buyNow(): void {
    if (!this.authSvc.isLoggedIn()) { this.notify.warning('Please login'); this.router.navigate(['/login']); return; }
    this.cartSvc.addToCart({ productId: this.product!.id, quantity: this.quantity }).subscribe({
      next: () => this.router.navigate(['/cart']), error: () => {}
    });
  }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) { this.reviewForm.markAllAsTouched(); return; }
    this.reviewLoading = true;
    this.reviewSvc.createReview({
      productId: this.product!.id,
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!
    }).subscribe({
      next: () => {
        this.reviewLoading = false;
        this.notify.success('Review submitted!');
        this.reviewForm.reset();
        this.selectedRating = 0;
        this.loadReviews(this.product!.id);
        this.loadRating(this.product!.id);
      },
      error: () => { this.reviewLoading = false; }
    });
  }

  getDiscountPercent(): number { return 15; }
  getOriginalPrice(): number { return Math.round((this.product?.price || 0) * (100 / 85)); }

  getDeliveryDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}
