import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  agents: any[] = [];
  formData: any = {};
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  showForm = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
    this.loading = true;
    this.apiService.getAgents().subscribe({
      next: (response) => {
        this.agents = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading agents: ' + (error.error?.message || error.statusText);
        this.loading = false;
      }
    });
  }

  saveAgent() {
    if (!this.formData.name) {
      this.errorMessage = 'Please fill in required fields';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.apiService.updateAgent(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Agent updated successfully!';
          this.loadAgents();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating agent: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    } else {
      this.apiService.createAgent(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Agent created successfully!';
          this.loadAgents();
          this.resetForm();
          this.loading = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error creating agent: ' + (error.error?.message || error.statusText);
          this.loading = false;
        }
      });
    }
  }

  editAgent(agent: any) {
    this.formData = { ...agent };
    this.editingId = agent.id;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAgent(id: number) {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.apiService.deleteAgent(id).subscribe({
        next: () => {
          this.successMessage = 'Agent deleted successfully!';
          this.loadAgents();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error deleting agent: ' + (error.error?.message || error.statusText);
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
