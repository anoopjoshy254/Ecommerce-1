import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, CreateProductRequest, UpdateProductRequest, UploadImageResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`);
  }

  createProduct(data: CreateProductRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, data);
  }

  updateProduct(id: number, data: Partial<UpdateProductRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadImageResponse>(`${this.apiUrl}/upload-image`, formData);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
  }
}
