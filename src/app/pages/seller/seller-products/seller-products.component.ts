import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoaderComponent, ConfirmationDialogComponent],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.css'
})
export class SellerProductsComponent implements OnInit {
  productSvc = inject(ProductService);
  notify = inject(NotificationService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  loading = false;
  deleteDialogVisible = false;
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getSellerProducts().subscribe({
      next: p => { this.products = p; this.filteredProducts = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  confirmDelete(p: Product): void {
    this.productToDelete = p;
    this.deleteDialogVisible = true;
  }

  doDelete(): void {
    if (!this.productToDelete) return;
    this.productSvc.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.notify.success('Product deleted');
        this.loadProducts();
        this.deleteDialogVisible = false;
        this.productToDelete = null;
      }
    });
  }

  toggleActive(p: Product): void {
    this.productSvc.updateProduct(p.id, { isActive: !p.isActive }).subscribe({
      next: () => {
        p.isActive = !p.isActive;
        this.notify.success(`Product ${p.isActive ? 'activated' : 'deactivated'}`);
      }
    });
  }

  getImageUrl(url: string): string { return this.productSvc.getImageUrl(url); }
}
