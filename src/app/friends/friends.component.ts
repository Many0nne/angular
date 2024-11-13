import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {
  friends: any[] = [];
  friendRequests: any[] = [];
  selectedUserId: string = '';
  users: any[] = [];
  currentUserId: string = '';

  constructor(private userService: UserService, private router : Router) {}

  ngOnInit(): void {
    this.loadFriends();
    this.loadFriendRequests();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  loadFriends(): void {
    this.userService.getFriends().subscribe(
      (data) => {
        this.friends = data;
        console.log('Friends', this.friends);
      },
      (error) => {
        console.error('Error fetching friends', error);
      }
    );
  }

  loadFriendRequests(): void {
    this.userService.getFriendRequests().subscribe(
      (data) => {
        this.friendRequests = data;
      },
      (error) => {
        console.error('Error fetching friend requests', error);
      }
    );
  }

  sendFriendRequest(): void {
    if (this.selectedUserId) {
      this.userService.sendFriendRequest(this.selectedUserId).subscribe(
        (response) => {
          console.log('Friend request sent', response);
          this.selectedUserId = '';
        },
        (error) => {
          console.error('Error sending friend request', error);
        }
      );
    } else {
      console.error('No user selected');
    }
  }

  acceptFriendRequest(requestId: string): void {
    this.userService.acceptFriendRequest(requestId).subscribe(
      (response) => {
        console.log('Friend request accepted', response);
        this.loadFriendRequests();
        this.loadFriends();
      },
      (error) => {
        console.error('Error accepting friend request', error);
      }
    );
  }

  rejectFriendRequest(requestId: string): void {
    this.userService.rejectFriendRequest(requestId).subscribe(
      (response) => {
        console.log('Friend request rejected', response);
        this.loadFriendRequests();
      },
      (error) => {
        console.error('Error rejecting friend request', error);
      }
    );
  }
}