import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; 
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatComponent } from '../chat/chat.component';
import { FriendsComponent } from '../friends/friends.component';
import { RouteCheckerService } from '../route-checker.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  currentRoute: string = '';
  
  constructor(private userService: UserService, private router: Router, private routeCheckerService: RouteCheckerService) {}

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
    this.routeCheckerService.getCurrentRoute().subscribe(route => {
      this.currentRoute = route;
      console.log('Current Route:', this.currentRoute)
    }, error => {
      console.error('Error getting current route:', error);
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
