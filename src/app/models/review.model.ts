export interface Review {
  reviewId: number;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RatingResponse {
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}
