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
  errorMessage = '';

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
    this.successMessage = '';
    this.errorMessage = '';
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
        
        // Safely extract the exact error message from Django if it exists
        if (err.error && typeof err.error === 'object') {
           this.errorMessage = Object.values(err.error).flat().join(' ');
        } else {
           this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
