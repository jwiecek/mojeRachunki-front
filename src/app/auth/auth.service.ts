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

  // createUser(email: string, password: string) {
  //   const authData: AuthData = { email: email, password: password };
  //   this.http.post(`${this.API_URL}/register`, authData).subscribe(response => console.log(response));
  // }
  //
  // login(email: string, password: string) {
  //   return this.http.post<any>(`/users/authenticate`, { email, password }).pipe(
  //     map(user => {
  //       if (user && user.token) {
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //       }
  //       return user;
  //     })
  //   );
  // }
  //
  // logout() {
  //   localStorage.removeItem('currentUser');
  // }
  //
  // registerUser(email: string, password: string): Observable<object> {
  //   return this.http.post(
  //     'http://localhost:3000/api/auth/register',
  //     { email, password },
  //     { headers: this.getHeaders() }
  //   );
  // }
  //
  // // Login User
  // loginUser(email: string, password: string): Observable<object> {
  //   this.http.post(`${this.API_URL}/auth/login`, { email, password }, { headers: this.getHeaders() });
  // }
}
