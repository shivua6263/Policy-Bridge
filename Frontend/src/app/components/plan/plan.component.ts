import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  plans: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.apiService.getPlans().subscribe({
      next: (response) => {
        this.plans = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading plans: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  savePlan() {
    if (!this.formData.name) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updatePlan(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Plan updated successfully!';
          this.loadPlans();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating plan: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createPlan(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Plan created successfully!';
          this.loadPlans();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating plan: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editPlan(plan: any) {
    this.formData = { ...plan };
    this.editingId = plan.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePlan(id: number) {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.apiService.deletePlan(id).subscribe({
        next: () => {
          this.successMessage = 'Plan deleted successfully!';
          this.loadPlans();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting plan: ' + (error.error?.message || error.statusText);
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
