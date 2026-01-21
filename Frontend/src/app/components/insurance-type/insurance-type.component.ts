import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-insurance-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance-type.component.html',
  styleUrls: ['./insurance-type.component.css']
})
export class InsuranceTypeComponent implements OnInit {
  types: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.loading = true;
    this.apiService.getInsuranceTypes().subscribe({
      next: (response) => {
        this.types = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading types: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  saveType() {
    if (!this.formData.name) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateInsuranceType(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Type updated successfully!';
          this.loadTypes();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating type: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createInsuranceType(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Type created successfully!';
          this.loadTypes();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating type: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editType(type: any) {
    this.formData = { ...type };
    this.editingId = type.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteType(id: number) {
    if (confirm('Are you sure you want to delete this type?')) {
      this.apiService.deleteInsuranceType(id).subscribe({
        next: () => {
          this.successMessage = 'Type deleted successfully!';
          this.loadTypes();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting type: ' + (error.error?.message || error.statusText);
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
