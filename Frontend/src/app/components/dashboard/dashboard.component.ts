import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    users: 0,
    agents: 0,
    customers: 0,
    policies: 0,
    plans: 0,
    companies: 0,
    types: 0,
    customerPolicies: 0
  };

  currentUser: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadStats();
  }

  loadStats() {
    this.apiService.getUsers().subscribe({
      next: (response) => {
        this.stats.users = response.length;
      },
      error: (error) => console.error('Error loading users', error)
    });

    this.apiService.getAgents().subscribe({
      next: (response) => {
        this.stats.agents = response.length;
      },
      error: (error) => console.error('Error loading agents', error)
    });

    this.apiService.getCustomers().subscribe({
      next: (response) => {
        this.stats.customers = response.length;
      },
      error: (error) => console.error('Error loading customers', error)
    });

    this.apiService.getPolicies().subscribe({
      next: (response) => {
        this.stats.policies = response.length;
      },
      error: (error) => console.error('Error loading policies', error)
    });

    this.apiService.getPlans().subscribe({
      next: (response) => {
        this.stats.plans = response.length;
      },
      error: (error) => console.error('Error loading plans', error)
    });

    this.apiService.getInsuranceCompanies().subscribe({
      next: (response) => {
        this.stats.companies = response.length;
      },
      error: (error) => console.error('Error loading companies', error)
    });

    this.apiService.getInsuranceTypes().subscribe({
      next: (response) => {
        this.stats.types = response.length;
      },
      error: (error) => console.error('Error loading types', error)
    });

    this.apiService.getCustomerPolicies().subscribe({
      next: (response) => {
        this.stats.customerPolicies = response.length;
      },
      error: (error) => console.error('Error loading customer policies', error)
    });
  }
}
