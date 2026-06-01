import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) {}

  downloadInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}`, { responseType: 'blob' });
  }

  triggerDownload(blob: Blob, orderId: number): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-order-${orderId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
