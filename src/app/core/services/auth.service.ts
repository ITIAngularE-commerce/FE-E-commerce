import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthData,
} from '../../interfaces/auth.interface';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notif = inject(NotificationService);

  currentUser = signal<AuthData | null>(this.loadUser());
  isLoggedIn = signal<boolean>(!!this.loadUser());

  private loadUser(): AuthData | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap({
        next: (res) => {
          const user = res.data;
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
          this.notif.success('Welcome back!', `Good to see you, ${user.fullName}`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.notif.error('Login failed', err?.error?.message || 'Invalid email or password');
        },
      }),
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, body).pipe(
      tap({
        next: (res) => {
          const user = res.data;
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
          this.notif.success('Account created!', `Welcome to ShopNow, ${user.fullName}`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.notif.error('Registration failed', err?.error?.message || 'Something went wrong');
        },
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.notif.info('Signed out', 'See you soon!');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return this.currentUser()?.role ?? null;
  }
}
