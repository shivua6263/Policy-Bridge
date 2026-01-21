import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  policies: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading = true;
    this.apiService.getPolicies().subscribe({
      next: (response) => {
        this.policies = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading policies: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  savePolicy() {
    if (!this.formData.policy_number) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updatePolicy(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Policy updated successfully!';
          this.loadPolicies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating policy: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createPolicy(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Policy created successfully!';
          this.loadPolicies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating policy: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editPolicy(policy: any) {
    this.formData = { ...policy };
    this.editingId = policy.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePolicy(id: number) {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.apiService.deletePolicy(id).subscribe({
        next: () => {
          this.successMessage = 'Policy deleted successfully!';
          this.loadPolicies();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting policy: ' + (error.error?.message || error.statusText);
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
