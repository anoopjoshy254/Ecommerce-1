import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cart.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<{ cartItemId: number; quantity: number }>();
  @Output() removed = new EventEmitter<number>();

  productSvc = inject(ProductService);

  getImageUrl(): string {
    return this.productSvc.getImageUrl(this.item.imageUrl);
  }

  increment(): void {
    this.quantityChanged.emit({ cartItemId: this.item.cartItemId, quantity: this.item.quantity + 1 });
  }

  decrement(): void {
    if (this.item.quantity > 1) {
      this.quantityChanged.emit({ cartItemId: this.item.cartItemId, quantity: this.item.quantity - 1 });
    }
  }

  remove(): void {
    this.removed.emit(this.item.cartItemId);
  }
}
