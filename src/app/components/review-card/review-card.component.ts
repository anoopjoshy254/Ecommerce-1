import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent {
  @Input() review!: Review;

  getInitial(): string {
    return this.review.user?.charAt(0)?.toUpperCase() || 'U';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}
