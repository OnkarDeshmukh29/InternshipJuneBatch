import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  login(credentials: any): Observable<any> {
    console.log('AuthService: Sending login request with credentials:', credentials);
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Save both JWT tokens to localStorage upon successful login
        if (response && response.access_token) {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);
        }
        if (response && response.refresh_token) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // http://localhost:8000/api/users/register

  logout(): void {
    // Remove both tokens from localStorage on logout
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
