import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { WishlistItem } from '../../models/user.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ProductCardComponent, ConfirmationDialogComponent, LoaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistSvc = inject(WishlistService);
  cartSvc = inject(CartService);
  notify = inject(NotificationService);
  router = inject(Router);

  wishlistItems: WishlistItem[] = [];
  loading = false;
  removeDialogVisible = false;
  itemToRemove: WishlistItem | null = null;

  ngOnInit(): void { this.loadWishlist(); }

  loadWishlist(): void {
    this.loading = true;
    this.wishlistSvc.getWishlist().subscribe({ next: items => { this.wishlistItems = items; this.loading = false; }, error: () => this.loading = false });
  }

  confirmRemove(item: WishlistItem): void {
    this.itemToRemove = item;
    this.removeDialogVisible = true;
  }

  doRemove(): void {
    if (!this.itemToRemove) return;
    this.wishlistSvc.removeWishlist(this.itemToRemove.wishlistId).subscribe({
      next: () => { this.notify.success('Removed from wishlist'); this.loadWishlist(); this.removeDialogVisible = false; this.itemToRemove = null; }
    });
  }

  addToCart(item: WishlistItem): void {
    this.cartSvc.addToCart({ productId: item.productId, quantity: 1 }).subscribe({
      next: () => this.notify.success(`${item.productName} added to cart!`), error: () => {}
    });
  }

  toProduct(item: WishlistItem): Product {
    return { id: item.productId, name: item.productName, description: item.description, price: item.price, stockQuantity: item.stock, imageUrl: item.imageUrl, isActive: true };
  }
}
