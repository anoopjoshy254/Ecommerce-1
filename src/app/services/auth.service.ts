import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, AuthUser } from '../models/auth.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'authUser';
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private storage = inject(StorageService);

  currentUser = signal<AuthUser | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor() {}

  register(request: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        this.storage.setItem(this.TOKEN_KEY, response.token);
        const user: AuthUser = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        };
        this.storage.setJson(this.USER_KEY, user);
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  isSeller(): boolean {
    return this.currentUser()?.role === 'Seller';
  }

  isBuyer(): boolean {
    return this.currentUser()?.role === 'Buyer';
  }

  private hasToken(): boolean {
    return !!this.storage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): AuthUser | null {
    return this.storage.getJson<AuthUser>(this.USER_KEY);
  }
}
