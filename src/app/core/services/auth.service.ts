import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoggedUser {
  idUser: number;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly USER_KEY = 'fintrack_user';

  currentUser = signal<LoggedUser | null>(this.loadFromStorage());

  private loadFromStorage(): LoggedUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private saveUser(user: LoggedUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  login(email: string, contrasena: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/login`, { email, contrasena }).pipe(
      tap(tokens => {
        const payload = this.decodeToken(tokens.access_token);
        const user: LoggedUser = {
          idUser: payload.idUsuario,
          name: payload.sub,
          email: payload.sub,
          role: payload.roles?.[0]?.authority?.replace('ROLE_', '') ?? 'USER',
          accessToken: tokens.access_token,   // ← lee access_token
          refreshToken: tokens.refresh_token,  // ← lee refresh_token
        };
        this.saveUser(user);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/register`, { name, email, password }).pipe(
      tap(tokens => {
        const payload = this.decodeToken(tokens.access_token);
        const user: LoggedUser = {
          idUser: payload.idUsuario,
          name: name,
          email: email,
          role: 'USER',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        };
        this.saveUser(user);
      })
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.currentUser()?.refreshToken;
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        const user = this.currentUser();
        if (user) {
          user.accessToken = tokens.access_token;
          user.refreshToken = tokens.refresh_token;
          this.saveUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getToken(): string {
    return this.currentUser()?.accessToken ?? '';
  }

  getUserId(): number {
    return this.currentUser()?.idUser ?? 0;
  }

  getUserName(): string {
    return this.currentUser()?.name ?? '';
  }

  getUserRole(): string {
    return this.currentUser()?.role ?? '';
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }
}
