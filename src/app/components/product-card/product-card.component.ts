import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() rating: number = 0;
  @Input() totalReviews: number = 0;
  @Input() isWishlisted: boolean = false;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();

  productSvc = inject(ProductService);
  reviewSvc = inject(ReviewService);

  discountPercent: number = 0;
  originalPrice: number = 0;

  ngOnInit(): void {
    if (this.product && this.product.id) {
      this.reviewSvc.getAverageRating(this.product.id).subscribe({
        next: (res) => {
          this.rating = res.averageRating;
          this.totalReviews = res.totalReviews;
        }
      });
      
      this.discountPercent = Math.floor(Math.random() * 20) + 10;
      this.originalPrice = Math.round(this.product.price * (100 / (100 - this.discountPercent)));
    }
  }

  getImageUrl(): string {
    return this.productSvc.getImageUrl(this.product.imageUrl);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleWishlist.emit(this.product);
  }

  isInStock(): boolean {
    return this.product.stockQuantity > 0;
  }
}
