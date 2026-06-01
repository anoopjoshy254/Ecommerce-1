import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  notify = inject(NotificationService);
  router = inject(Router);

  loading = false;
  showPassword = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { name, email, phone, password } = this.form.value;
    this.auth.register({ name: name!, email: email!, phone: phone!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Account created! Please login.');
        this.router.navigate(['/login']);
      },
      error: () => { this.loading = false; }
    });
  }

  getPasswordStrength(): { label: string; class: string; width: string } {
    const pw = this.form.get('password')?.value || '';
    if (!pw) return { label: '', class: '', width: '0%' };
    let score = 0;
    if (pw.length >= 5) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', class: 'strength-weak', width: '25%' };
    if (score <= 2) return { label: 'Fair', class: 'strength-fair', width: '50%' };
    if (score <= 3) return { label: 'Good', class: 'strength-good', width: '75%' };
    return { label: 'Strong', class: 'strength-strong', width: '100%' };
  }

  get nameCtrl() { return this.form.get('name')!; }
  get emailCtrl() { return this.form.get('email')!; }
  get phoneCtrl() { return this.form.get('phone')!; }
  get passwordCtrl() { return this.form.get('password')!; }
}
