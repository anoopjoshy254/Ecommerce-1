import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requestCount = 0;
  isLoading = signal<boolean>(false);

  show(): void {
    this.requestCount++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      setTimeout(() => this.isLoading.set(false));
    }
  }
}
