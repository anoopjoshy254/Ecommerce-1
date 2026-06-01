import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { WishlistItem } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  wishlistCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl).pipe(
      tap(items => this.wishlistCount.set(items?.length ?? 0))
    );
  }

  addWishlist(productId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/add`, { productId }).pipe(
      tap(() => this.wishlistCount.update(c => c + 1))
    );
  }

  removeWishlist(wishlistId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${wishlistId}`).pipe(
      tap(() => this.wishlistCount.update(c => Math.max(0, c - 1)))
    );
  }

  resetCount(): void {
    this.wishlistCount.set(0);
  }
}
