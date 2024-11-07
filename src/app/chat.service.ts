import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://427b-2a01-cb05-83c6-5100-438c-110-a640-e315.ngrok-free.app/');
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