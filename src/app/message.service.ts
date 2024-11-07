import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/messages';
  private privateSocket = io('http://localhost:3000/private');

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }

  getAllPrivateMessages(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/private-messages`, { headers });
  }

  getPrivateMessages(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/private-messages/${userId}`, { headers }).pipe(
      tap(messages => console.log('Private messages:', messages)) // Ajouter un console.log ici
    );
  }

  sendPrivateMessage(message: any): void {
    this.privateSocket.emit('sendPrivateMessage', message);
  }

  onNewPrivateMessage(): Observable<any> {
    return new Observable(observer => {
      this.privateSocket.on('receivePrivateMessage', (message) => {
        observer.next(message);
      });
    });
  }

  joinRoom(room: string): void {
    this.privateSocket.emit('joinRoom', room);
  }
}