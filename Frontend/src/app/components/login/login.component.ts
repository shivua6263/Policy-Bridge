import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.apiService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
