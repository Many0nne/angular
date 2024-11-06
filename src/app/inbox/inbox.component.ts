import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

// Définir l'interface pour les messages privés
interface PrivateMessage {
  sender: string;
  receiver: string;
  content: string;
  timestamp?: Date;
  room: string; // Ajouter la propriété room
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  users: any[] = [];
  messages: PrivateMessage[] = []; // Utiliser l'interface pour typer les messages
  selectedUser: any;
  newMessage: string = '';
  userInfo: any;
  filteredUsers: any[] = [];

  @ViewChild('inboxContainer') private messagesContainer!: any;

  constructor(private messageService: MessageService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.checkLogin();
    this.messageService.onNewPrivateMessage().subscribe({
      next: (message: PrivateMessage) => {
        if (this.isMessageRelevant(message)) {
          this.messages.push(message);
        }
      },
      error: (error) => {
        console.error('Error receiving new private message', error);
      }
    });
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  checkLogin(): void {
    if (this.userService.isLoggedIn()) {
      this.userService.getUserProfile().subscribe(
        (data) => {
          this.userInfo = data;
          console.log(this.userInfo);
          this.loadUsers(); // Charger les utilisateurs après avoir obtenu les informations de l'utilisateur connecté
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUsers(): void {
    this.messageService.getUsers().subscribe({
      next: (users: any[]) => {
        this.users = users;
        this.filteredUsers = this.users.filter(user => user._id !== this.userInfo._id);
        if (this.filteredUsers.length > 0) {
          this.selectUser(this.filteredUsers[0]); // Sélectionne le premier utilisateur par défaut
        }
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.loadMessages();
    this.messageService.joinRoom(this.getRoomName());
    
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  loadMessages(): void {
    if (this.selectedUser) {
      this.messageService.getPrivateMessages(this.selectedUser._id).subscribe({
        next: (messages: PrivateMessage[]) => {
          this.messages = messages.filter(message => this.isMessageRelevant(message));
        },
        error: (error) => {
          console.error('Error fetching private messages', error);
        }
      });
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') {
      return;
    }

    const message: PrivateMessage = {
      sender: this.userInfo._id,
      receiver: this.selectedUser._id,
      content: this.newMessage,
      room: this.getRoomName() // Ajouter la propriété room
    };

    this.messageService.sendPrivateMessage(message);
    this.newMessage = '';

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  getRoomName(): string {
    return [this.userInfo._id, this.selectedUser._id].sort().join('_');
  }

  isMessageRelevant(message: PrivateMessage): boolean {
    return (message.sender === this.userInfo._id && message.receiver === this.selectedUser._id) ||
            (message.sender === this.selectedUser._id && message.receiver === this.userInfo._id);
  }

  scrollToBottom(): void {
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }
}