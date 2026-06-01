import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, LoaderComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  fb = inject(FormBuilder);
  productSvc = inject(ProductService);
  notify = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  product: Product | null = null;
  productId!: number;

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.productSvc.getProductById(this.productId).subscribe({
      next: p => {
        this.product = p;
        this.form.patchValue({
          name: p.name,
          description: p.description,
          price: p.price,
          stockQuantity: p.stockQuantity,
          isActive: p.isActive
        });
        this.imagePreview = this.productSvc.getImageUrl(p.imageUrl);
        this.loading = false;
      },
      error: () => { this.loading = false; this.router.navigate(['/seller/products']); }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    this.loading = true;
    
    const submitUpdate = (imageUrl?: string) => {
      const payload: any = { ...this.form.value };
      if (imageUrl) {
        payload.imageUrl = imageUrl;
      }
      this.productSvc.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.notify.success('Product updated successfully');
          this.router.navigate(['/seller/products']);
        },
        error: () => this.loading = false
      });
    };

    if (this.selectedFile) {
      this.productSvc.uploadImage(this.selectedFile).subscribe({
        next: res => submitUpdate(res.imageUrl),
        error: () => { this.loading = false; this.notify.error('Image upload failed'); }
      });
    } else {
      submitUpdate();
    }
  }

  get f() { return this.form.controls; }
}
