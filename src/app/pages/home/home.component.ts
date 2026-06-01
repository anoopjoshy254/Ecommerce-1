import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { WishlistItem } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, ProductCardComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productSvc = inject(ProductService);
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);
  authSvc = inject(AuthService);
  notify = inject(NotificationService);
  router = inject(Router);

  products: Product[] = [];
  wishlistItems: WishlistItem[] = [];
  currentBanner = 0;
  loading = false;

  banners = [
    { title: 'Biggest Sale Ever', subtitle: 'Up to 80% off on premium electronics', cta: 'Shop Now', color: 'linear-gradient(135deg, #0f172a, #334155)', icon: 'bi-lightning-charge' },
    { title: 'The Fashion Edit', subtitle: 'Curated styles for the modern wardrobe', cta: 'Explore Collection', color: 'linear-gradient(135deg, #4c0519, #be123c)', icon: 'bi-stars' },
    { title: 'Elevate Your Space', subtitle: 'Minimalist decor & home essentials', cta: 'Discover', color: 'linear-gradient(135deg, #064e3b, #059669)', icon: 'bi-house' },
  ];

  categories = [
    { name: 'Electronics', icon: 'bi-laptop', color: '#2874f0', bg: '#e8f0fe' },
    { name: 'Fashion', icon: 'bi-bag', color: '#e91e63', bg: '#fce4ec' },
    { name: 'Home & Kitchen', icon: 'bi-house', color: '#ff9800', bg: '#fff3e0' },
    { name: 'Books', icon: 'bi-book', color: '#4caf50', bg: '#e8f5e9' },
    { name: 'Sports', icon: 'bi-trophy', color: '#9c27b0', bg: '#f3e5f5' },
    { name: 'Beauty', icon: 'bi-stars', color: '#f44336', bg: '#ffebee' },
    { name: 'Toys', icon: 'bi-puzzle', color: '#00bcd4', bg: '#e0f7fa' },
    { name: 'Grocery', icon: 'bi-cart3', color: '#795548', bg: '#efebe9' },
  ];

  ngOnInit(): void {
    this.loadProducts();
    if (this.authSvc.isLoggedIn()) {
      this.loadWishlist();
    }
    this.startBannerRotation();
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadWishlist(): void {
    this.wishlistSvc.getWishlist().subscribe({
      next: (items) => { this.wishlistItems = items; },
      error: () => {}
    });
  }

  startBannerRotation(): void {
    setInterval(() => {
      this.currentBanner = (this.currentBanner + 1) % this.banners.length;
    }, 4000);
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistItems.some(w => w.productId === productId);
  }

  onAddToCart(product: Product): void {
    if (!this.authSvc.isLoggedIn()) {
      this.notify.warning('Please login to add items to cart');
      this.router.navigate(['/login']);
      return;
    }
    this.cartSvc.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => this.notify.success(`${product.name} added to cart!`),
      error: () => {}
    });
  }

  onToggleWishlist(product: Product): void {
    if (!this.authSvc.isLoggedIn()) {
      this.notify.warning('Please login to use wishlist');
      this.router.navigate(['/login']);
      return;
    }
    const item = this.wishlistItems.find(w => w.productId === product.id);
    if (item) {
      this.wishlistSvc.removeWishlist(item.wishlistId).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(w => w.wishlistId !== item.wishlistId);
          this.notify.info('Removed from wishlist');
        }
      });
    } else {
      this.wishlistSvc.addWishlist(product.id).subscribe({
        next: () => {
          this.loadWishlist();
          this.notify.success('Added to wishlist!');
        }
      });
    }
  }

  get featuredProducts(): Product[] {
    return this.products.filter(p => p.isActive).slice(0, 8);
  }

  get newArrivals(): Product[] {
    return this.products.filter(p => p.isActive).slice(8, 16);
  }
}
