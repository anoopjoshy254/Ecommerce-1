import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
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
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, ProductCardComponent, LoaderComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productSvc = inject(ProductService);
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);
  authSvc = inject(AuthService);
  notify = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  wishlistItems: WishlistItem[] = [];
  searchKeyword = '';
  sortBy = 'default';
  minPrice = 0;
  maxPrice = 100000;
  inStockOnly = false;
  viewMode: 'grid' | 'list' = 'grid';
  loading = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const keyword = params['keyword'] || '';
      this.searchKeyword = keyword;
      if (keyword) {
        this.searchProducts(keyword);
      } else {
        this.loadProducts();
      }
    });

    if (this.authSvc.isLoggedIn()) {
      this.wishlistSvc.getWishlist().subscribe({ next: items => this.wishlistItems = items, error: () => {} });
    }

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(keyword => keyword ? this.productSvc.searchProducts(keyword) : this.productSvc.getProducts())
    ).subscribe({
      next: products => { this.allProducts = products; this.applyFilters(); },
      error: () => {}
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getProducts().subscribe({
      next: products => { this.allProducts = products; this.applyFilters(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  searchProducts(keyword: string): void {
    this.loading = true;
    this.productSvc.searchProducts(keyword).subscribe({
      next: products => { this.allProducts = products; this.applyFilters(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchKeyword);
  }

  applyFilters(): void {
    let result = [...this.allProducts].filter(p => p.isActive);
    if (this.inStockOnly) result = result.filter(p => p.stockQuantity > 0);
    result = result.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);
    switch (this.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt||'').getTime() - new Date(a.createdAt||'').getTime()); break;
    }
    this.filteredProducts = result;
  }

  resetFilters(): void {
    this.minPrice = 0; this.maxPrice = 100000; this.inStockOnly = false; this.sortBy = 'default';
    this.applyFilters();
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistItems.some(w => w.productId === productId);
  }

  onAddToCart(product: Product): void {
    if (!this.authSvc.isLoggedIn()) { this.notify.warning('Please login to add items to cart'); this.router.navigate(['/login']); return; }
    this.cartSvc.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => this.notify.success(`${product.name} added to cart!`), error: () => {}
    });
  }

  onToggleWishlist(product: Product): void {
    if (!this.authSvc.isLoggedIn()) { this.notify.warning('Please login to use wishlist'); this.router.navigate(['/login']); return; }
    const item = this.wishlistItems.find(w => w.productId === product.id);
    if (item) {
      this.wishlistSvc.removeWishlist(item.wishlistId).subscribe({ next: () => { this.wishlistItems = this.wishlistItems.filter(w => w.wishlistId !== item.wishlistId); this.notify.info('Removed from wishlist'); } });
    } else {
      this.wishlistSvc.addWishlist(product.id).subscribe({ next: () => { this.wishlistSvc.getWishlist().subscribe({ next: items => this.wishlistItems = items }); this.notify.success('Added to wishlist!'); } });
    }
  }
}
