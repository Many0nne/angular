import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})



export class ChatComponent implements OnInit {
  message: string = '';
  messages: any[] = [];
  userInfo: any;

  @ViewChild('chatContainer') private messagesContainer!: any;

  constructor(private chatService: ChatService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.checkLogin();
    this.loadPreviousMessages();
    this.chatService.receiveMessages().subscribe((message: any) => {
      this.messages.push(message);
    });

    this.chatService.receivePreviousMessages().subscribe((messages: any[]) => {
      this.messages = messages;
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
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    } else {

      this.router.navigate(['/login']);
    }
  }

  loadPreviousMessages(): void {
    this.chatService.receivePreviousMessages().subscribe((messages: any[]) => {
      this.messages = messages;
    });
  }

  isMentioned(message: string): boolean {
    if (message.includes('@' + this.userInfo.name)) {
      return true;
    }
    return false;
  }

  sendMessage(): void {
    if (this.message.trim() === '') {
      return;
    }

    const message = {
      sender: this.userInfo.name,
      content: this.message
    };

    this.chatService.sendMessage(message);
    this.message = '';
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);        
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

}

