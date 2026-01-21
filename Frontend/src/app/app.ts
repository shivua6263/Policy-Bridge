import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showNavbar = false;

  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.isAuthenticated$.subscribe(isAuth => {
      this.showNavbar = isAuth;
    });
  }

  ngOnInit() {
    // Refresh auth state on app initialization (handles page refresh scenarios)
    this.apiService.refreshAuthState();
    console.log('App: Auth state refreshed on initialization');
  }
}
