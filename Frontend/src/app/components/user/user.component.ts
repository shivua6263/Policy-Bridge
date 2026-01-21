import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('UserComponent initialized, loading users...');
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    console.log('Starting to load users...');
    
    this.apiService.getUsers().subscribe({
      next: (response) => {
        console.log('Users loaded successfully:', response);
        this.users = response;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading users:', error);
        const errorMsg = error.error?.message || error.statusText || 'Unknown error';
        this.errorMessage = 'Error loading users: ' + errorMsg;
        this.loading = false;
        this.users = [];
      }
    });
  }

  saveUser() {
    if (!this.formData.name || !this.formData.email) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateUser(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'User updated successfully!';
          this.loadUsers();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating user: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createUser(this.formData).subscribe({
        next: () => {
          this.successMessage = 'User created successfully!';
          this.loadUsers();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating user: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editUser(user: any) {
    this.formData = { ...user };
    this.editingId = user.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          this.loadUsers();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting user: ' + (error.error?.message || error.statusText);
        }
      });
    }
  }

  resetForm() {
    this.formData = {};
    this.editingId = null;
    this.errorMessage = '';
    this.showForm = false;
  }
}
