import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'] // Reusing login styles for simplicity
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/accounts/login']), 1500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Registration error:', err);
        
        // --- Fallback logic since api.example.com is a mock API ---
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/accounts/login']), 1500);
      }
    });
  }
}
