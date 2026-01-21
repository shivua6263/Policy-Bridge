import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-insurance-company',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance-company.component.html',
  styleUrls: ['./insurance-company.component.css']
})
export class InsuranceCompanyComponent implements OnInit {
  companies: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.loading = true;
    this.apiService.getInsuranceCompanies().subscribe({
      next: (response) => {
        this.companies = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading companies: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  saveCompany() {
    if (!this.formData.name) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateInsuranceCompany(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Company updated successfully!';
          this.loadCompanies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating company: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createInsuranceCompany(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Company created successfully!';
          this.loadCompanies();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating company: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editCompany(company: any) {
    this.formData = { ...company };
    this.editingId = company.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.apiService.deleteInsuranceCompany(id).subscribe({
        next: () => {
          this.successMessage = 'Company deleted successfully!';
          this.loadCompanies();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting company: ' + (error.error?.message || error.statusText);
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
