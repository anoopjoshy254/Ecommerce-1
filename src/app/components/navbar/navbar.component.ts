import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  notify = inject(NotificationService);
  router = inject(Router);

  searchQuery = '';
  showUserMenu = false;

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.cart.refreshCount();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { keyword: this.searchQuery.trim() } });
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }

  logout(): void {
    this.auth.logout();
    this.cart.resetCount();
    this.wishlist.resetCount();
    this.notify.success('Logged out successfully!');
    this.router.navigate(['/login']);
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeMenu(): void {
    this.showUserMenu = false;
  }
}
