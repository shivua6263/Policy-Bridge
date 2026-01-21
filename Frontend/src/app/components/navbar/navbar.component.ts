import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  mobileMenuOpen = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.isAuthenticated$.subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
    });

    this.apiService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
