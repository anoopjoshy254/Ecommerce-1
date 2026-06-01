import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoveredStar: number = 0;

  getStarClass(star: number): string {
    const effective = this.hoveredStar || this.rating;
    if (star <= Math.floor(effective)) return 'bi-star-fill';
    if (star - 0.5 <= effective) return 'bi-star-half';
    return 'bi-star';
  }

  onHover(star: number): void {
    if (!this.readonly) this.hoveredStar = star;
  }

  onLeave(): void {
    if (!this.readonly) this.hoveredStar = 0;
  }

  onClick(star: number): void {
    if (!this.readonly) {
      this.ratingChange.emit(star);
    }
  }
}
