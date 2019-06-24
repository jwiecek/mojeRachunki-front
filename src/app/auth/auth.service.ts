import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http://localhost:3000';

  private isAuthenticated = false;
  private token: string;
  userId: string;
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
          this.userId = user.userId;
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
