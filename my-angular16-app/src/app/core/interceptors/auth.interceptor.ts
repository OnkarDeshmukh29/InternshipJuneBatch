import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Get the token from AuthService
    const token = this.authService.getToken();

    // 2. Clone the request and add the Authorization header if the token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. Pass the cloned request to the next handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // 4. Global Error Handling (e.g., catching 401 Unauthorized)
        if (error.status === 401) {
          console.warn('AuthInterceptor: 401 Unauthorized. Logging out...');
          this.authService.logout();
          this.router.navigate(['/accounts/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
