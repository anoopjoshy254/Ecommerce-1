import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, LoaderComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  fb = inject(FormBuilder);
  productSvc = inject(ProductService);
  notify = inject(NotificationService);
  router = inject(Router);

  loading = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

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
    const formVal = this.form.value;
    
    if (this.selectedFile) {
      this.productSvc.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.createProductWithImage(res.imageUrl);
        },
        error: () => setTimeout(() => this.loading = false)
      });
    } else {
      this.createProductWithImage('');
    }
  }

  private createProductWithImage(imageUrl: string): void {
    const formVal = this.form.value;
    const payload = {
      name: formVal.name!,
      description: formVal.description!,
      price: Number(formVal.price),
      stockQuantity: Number(formVal.stockQuantity),
      imageUrl: imageUrl
    };

    this.productSvc.createProduct(payload).subscribe({
      next: () => {
        setTimeout(() => this.loading = false);
        this.notify.success('Product created successfully');
        this.router.navigate(['/seller/products']);
      },
      error: () => setTimeout(() => this.loading = false)
    });
  }

  get f() { return this.form.controls; }
}
