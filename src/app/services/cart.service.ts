import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart, AddToCartRequest, UpdateCartRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  cartCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartCount.set(cart.items?.length ?? 0))
    );
  }

  addToCart(request: AddToCartRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/add`, request).pipe(
      tap(() => this.cartCount.update(c => c + 1))
    );
  }

  updateCart(request: UpdateCartRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/update`, request);
  }

  removeFromCart(cartItemId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${cartItemId}`).pipe(
      tap(() => this.cartCount.update(c => Math.max(0, c - 1)))
    );
  }

  refreshCount(): void {
    this.getCart().subscribe({
      next: cart => this.cartCount.set(cart.items?.length ?? 0),
      error: () => this.cartCount.set(0)
    });
  }

  resetCount(): void {
    this.cartCount.set(0);
  }
}
