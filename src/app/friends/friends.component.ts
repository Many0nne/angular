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
  newFriendEmail: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadFriends();
    this.loadFriendRequests();
  }

  loadFriends(): void {
    this.userService.getFriends().subscribe(
      (data) => {
        this.friends = data;
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
    this.userService.checkEmailExists(this.newFriendEmail).subscribe(
      (exists) => {
        if (exists) {
          this.userService.sendFriendRequest(exists._id).subscribe(
            (response) => {
              console.log('Friend request sent', response);
              this.newFriendEmail = '';
            },
            (error) => {
              console.error('Error sending friend request', error);
            }
          );
        } else {
          console.error('User not found');
        }
      },
      (error) => {
        console.error('Error checking email', error);
      }
    );
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