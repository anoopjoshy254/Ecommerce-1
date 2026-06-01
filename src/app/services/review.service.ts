import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, RatingResponse, CreateReviewRequest, UpdateReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
  }

  getAverageRating(productId: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.apiUrl}/rating/${productId}`);
  }

  createReview(request: CreateReviewRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, request);
  }

  updateReview(id: number, request: UpdateReviewRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, request);
  }
}
