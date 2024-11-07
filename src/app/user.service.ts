import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://427b-2a01-cb05-83c6-5100-438c-110-a640-e315.ngrok-free.app/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  getUserInfo(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-email?email=${email}`);
  }

  updateUserProfile(userInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/me`, userInfo, { headers });
  }
}

interface AuthResponse {
  token: string;
  user: any;
}