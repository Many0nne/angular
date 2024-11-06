import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})


export class UserComponent implements OnInit {
  users: any[] = [];
  newUser = { name: '', email: '', password: '' };
  isSubmitted = false;
  emailExists = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  addUser(useForm: NgForm): void {
    if (this.newUser.name && this.newUser.email && this.newUser.password) {
      this.userService.checkEmailExists(this.newUser.email).subscribe((exists) => {
        if (exists) {
          this.emailExists = true;
        } else {
          this.userService.createUser(this.newUser).subscribe((user) => {
            this.users.push(user);
            this.newUser = { name: '', email: '', password: '' };
            useForm.resetForm();
            this.isSubmitted = true;
            this.emailExists = false;
            this.router.navigate(['/login']);
          });
        }
      });
    }
  }
  
}