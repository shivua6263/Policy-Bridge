import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customer-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-policy.component.html',
  styleUrls: ['./customer-policy.component.css']
})
export class CustomerPolicyComponent implements OnInit {
  customerPolicies: any[] = [];
  customers: any[] = [];
  policies: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCustomerPolicies();
    this.loadCustomers();
    this.loadPolicies();
  }

  loadCustomerPolicies() {
    this.loading = true;
    this.apiService.getCustomerPolicies().subscribe({
      next: (response) => {
        this.customerPolicies = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading customer policies: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  loadCustomers() {
    this.apiService.getCustomers().subscribe({
      next: (response) => {
        this.customers = response;
      },
      error: (error) => {
        console.error('Error loading customers', error);
      }
    });
  }

  loadPolicies() {
    this.apiService.getPolicies().subscribe({
      next: (response) => {
        this.policies = response;
      },
      error: (error) => {
        console.error('Error loading policies', error);
      }
    });
  }

  saveCustomerPolicy() {
    if (!this.formData.customer || !this.formData.policy) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateCustomerPolicy(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Customer Policy updated successfully!';
          this.loadCustomerPolicies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating customer policy: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createCustomerPolicy(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Customer Policy created successfully!';
          this.loadCustomerPolicies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating customer policy: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editCustomerPolicy(cp: any) {
    this.formData = { ...cp };
    this.editingId = cp.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCustomerPolicy(id: number) {
    if (confirm('Are you sure you want to delete this customer policy?')) {
      this.apiService.deleteCustomerPolicy(id).subscribe({
        next: () => {
          this.successMessage = 'Customer Policy deleted successfully!';
          this.loadCustomerPolicies();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting customer policy: ' + (error.error?.message || error.statusText);
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
