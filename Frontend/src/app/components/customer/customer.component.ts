import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.apiService.getCustomers().subscribe({
      next: (response) => {
        this.customers = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading customers: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  saveCustomer() {
    if (!this.formData.name) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateCustomer(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Customer updated successfully!';
          this.loadCustomers();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating customer: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createCustomer(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Customer created successfully!';
          this.loadCustomers();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating customer: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editCustomer(customer: any) {
    this.formData = { ...customer };
    this.editingId = customer.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.apiService.deleteCustomer(id).subscribe({
        next: () => {
          this.successMessage = 'Customer deleted successfully!';
          this.loadCustomers();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting customer: ' + (error.error?.message || error.statusText);
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
