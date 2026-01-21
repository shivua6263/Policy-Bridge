import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { AgentComponent } from './components/agent/agent.component';
import { CustomerComponent } from './components/customer/customer.component';
import { PolicyComponent } from './components/policy/policy.component';
import { PlanComponent } from './components/plan/plan.component';
import { InsuranceCompanyComponent } from './components/insurance-company/insurance-company.component';
import { InsuranceTypeComponent } from './components/insurance-type/insurance-type.component';
import { CustomerPolicyComponent } from './components/customer-policy/customer-policy.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'agents', component: AgentComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'policies', component: PolicyComponent, canActivate: [AuthGuard] },
  { path: 'plans', component: PlanComponent, canActivate: [AuthGuard] },
  { path: 'insurance-companies', component: InsuranceCompanyComponent, canActivate: [AuthGuard] },
  { path: 'insurance-types', component: InsuranceTypeComponent, canActivate: [AuthGuard] },
  { path: 'customer-policies', component: CustomerPolicyComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
