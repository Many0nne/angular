import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSubmitted = false;
  user = { email: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  login(userForm: NgForm): void {
    if (this.user.email && this.user.password) {
      this.userService.login(this.user).subscribe((data) => {
        this.isSubmitted = true;
        userForm.resetForm();
        this.router.navigate(['/home']);
      });
    }
  }
}
