import { Component } from '@angular/core';
import { UserService } from '../user.service'; 
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatComponent } from '../chat/chat.component';
import { FriendsComponent } from '../friends/friends.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  constructor(private userService: UserService, private router: Router) {}

  checkLogin(): void {
  
  if (this.userService.isLoggedIn()) {
    console.log('User is logged in');
  } else {
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }};

  ngOnInit() {
    this.checkLogin();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
