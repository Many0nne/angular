import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  createUser(user: any): Observable<any> {
    console.log('Creating user with data:', user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, user, { headers }).pipe (
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
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


  
  sendFriendRequest(recipientId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/me/friends/request`, { recipientId }, { headers });
  }

  acceptFriendRequest(requestId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/me/friends/accept`, { requestId }, { headers });
  }

  rejectFriendRequest(requestId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/me/friends/reject`, { requestId }, { headers });
  }

  getFriendRequests(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me/friends/requests`, { headers });
  }

  getFriends(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me/friends`, { headers });
  }

  calculateDiscount(price: number): number {
    if (price > 100) {
      return price * 0.10;
    }
    return 0;
  }
}

interface AuthResponse {
  token: string;
  user: any;
}