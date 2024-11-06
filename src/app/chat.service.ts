import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  sendMessage(message: any): void {
    this.socket.emit('sendMessage', message);
  }

  receiveMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (message: any) => {
        observer.next(message);
      });
    });
  }

  receivePreviousMessages(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.on('previousMessages', (messages: any[]) => {
        observer.next(messages);
      });
    });
  }
}