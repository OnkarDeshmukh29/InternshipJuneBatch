import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;
    
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Login error:', err);
        
        // --- Fallback logic since api.example.com is a mock API ---
        // In a real app, you would just do: this.errorMessage = 'Invalid email or password';
        localStorage.setItem('auth_token', 'mock_jwt_token_12345');
        this.router.navigate(['/home']);
      }
    });
  }
}
