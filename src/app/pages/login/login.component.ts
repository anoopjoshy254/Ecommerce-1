import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  notify = inject(NotificationService);
  router = inject(Router);

  loading = false;
  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.loading = false;
        this.notify.success(`Welcome back, ${res.name}!`);
        if (res.role === 'Seller') {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  get emailCtrl() { return this.form.get('email')!; }
  get passwordCtrl() { return this.form.get('password')!; }
}
