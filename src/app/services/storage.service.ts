import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  getJson<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  setJson(key: string, value: unknown): void {
    this.setItem(key, JSON.stringify(value));
  }
}
