import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [ FormsModule, CommonModule, SidebarComponent ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.css'
})
export class ModifyComponent {
  
  userInfo: any = {};
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.userInfo = data;
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
  }

  onSubmit(): void {
    this.userService.updateUserProfile(this.userInfo).subscribe({
      next: (data: any) => {
        console.log('User information updated successfully', data);
        window.location.href = '/account';
      },
      error: (error) => {
        console.error('Error updating user information', error);
      }
    });
  }
}
