import { Component, NgModule } from '@angular/core';
import { UserService } from '../user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from '../friends/friends.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SidebarComponent, FormsModule, CommonModule, FriendsComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userInfo: any;
  selectedFile: File | null = null;
  
  constructor(private userService: UserService, private router: Router, private http: HttpClient) {}

  checkLogin(): void {
  
    if (this.userService.isLoggedIn()) {
      console.log('User is logged in');
    } else {
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }};

  ngOnInit(): void {
    this.checkLogin();
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.userInfo = data;
        console.log('User profile', this.userInfo);
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
    
  }

  navigateToModify(): void {
    this.router.navigate(['/modify']);
  }
}