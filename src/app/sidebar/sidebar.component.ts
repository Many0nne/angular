import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarComponent implements OnInit, OnDestroy {

  socket: Socket;
  users: { username: string, status: string }[] = [];
  username: any

  constructor(private userService: UserService, private router: Router) {
    // Connecter au serveur Socket.io
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    // Récupération du profil utilisateur avant d'émettre l'événement `user-connected`
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.username = data.name;
        console.log(`Username: ${this.username}`);
        
        // Émettre l'événement `user-connected` une fois le username défini
        this.socket.emit('user-connected', this.username);
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
  
    // Ecouter les mises à jour des utilisateurs connectés
    this.socket.on('update-user-list', (users: any[]) => {
      this.users = users.map(user => ({ 
        username: user.username, 
        status: user.status 
      }));
      console.log(this.users);
    });
  
    // Mettre à jour le statut en fonction de l'événement
    this.socket.on('update-status', (username: string, status: string) => {
      const user = this.users.find(user => user.username === username);
      if (user) {
        user.status = status;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Lorsque le composant est détruit, se déconnecter du serveur Socket.io
    this.socket.disconnect();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  // Méthode pour changer le statut
  updateStatus(username: string, status: string): void {
    this.socket.emit('update-status', username, status);
  }
}
