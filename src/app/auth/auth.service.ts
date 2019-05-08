import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthData } from './auth-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  registerUser(user) {
    return this.http.post(`${this.API_URL}/users/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`/auth/login`, { email, password }).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
