import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthData } from './auth-data.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http://localhost:3000';

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(userData: User) {
    return this.http.post(`${this.API_URL}/users/register`, userData);
  }

  login(userData: User) {
    return this.http.post<any>(`${this.API_URL}/auth/login`, userData).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.token = user.token;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
        return user;
      })
    );
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }
}
