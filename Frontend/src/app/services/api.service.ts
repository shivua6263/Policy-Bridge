import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Initialize auth state from localStorage if in browser
    if (this.isBrowser) {
      this.restoreAuthState();
    }
  }

  // Restore authentication state from localStorage
  private restoreAuthState(): void {
    if (!this.isBrowser) return;
    
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('user');
      
      // Only restore if both flags exist and user data is valid
      if (isAuthenticated === 'true' && user) {
        try {
          const userData = JSON.parse(user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(userData);
          console.log('AuthService: Authentication state restored from localStorage');
        } catch (e) {
          // Invalid JSON, clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        }
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  // Decode JWT token (without verification - for client side only)
  private decodeToken(token: string): any {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (2nd part)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Pad the base64 string if necessary
      const padLength = 4 - (base64.length % 4);
      const paddedBase64 = padLength !== 4 ? base64 + '='.repeat(padLength) : base64;
      
      let jsonPayload: string;
      try {
        jsonPayload = atob(paddedBase64);
      } catch (e) {
        return null;
      }

      let decoded: any;
      try {
        decoded = JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Authentication endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { email, password }).pipe(
      tap((response: any) => {
        if (response && this.isBrowser) {
          // Store user details directly (no JWT token needed)
          const user = {
            id: response.id,
            name: response.name,
            email: response.email,
            phone: response.phone || '',
            address: response.address || '',
            user_type: response.user_type || 'user',
            message: response.message
          };
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/`, userData);
  }

  // User endpoints
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}/`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/`, userData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}/`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}/`);
  }

  // Agent endpoints
  getAgents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/`);
  }

  getAgent(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/${id}/`);
  }

  createAgent(agentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/`, agentData);
  }

  updateAgent(id: number, agentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agent/${id}/`, agentData);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agent/${id}/`);
  }

  // Customer endpoints
  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/`);
  }

  getCustomer(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/${id}/`);
  }

  createCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/`, customerData);
  }

  updateCustomer(id: number, customerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/customer/${id}/`, customerData);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/${id}/`);
  }

  // Policy endpoints
  getPolicies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/policy/`);
  }

  getPolicy(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/policy/${id}/`);
  }

  createPolicy(policyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/policy/`, policyData);
  }

  updatePolicy(id: number, policyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/policy/${id}/`, policyData);
  }

  deletePolicy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/policy/${id}/`);
  }

  // Plan endpoints
  getPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/plan/`);
  }

  getPlan(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/plan/${id}/`);
  }

  createPlan(planData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/plan/`, planData);
  }

  updatePlan(id: number, planData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/plan/${id}/`, planData);
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/plan/${id}/`);
  }

  // Insurance Company endpoints
  getInsuranceCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insurancecompany/`);
  }

  getInsuranceCompany(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/insurancecompany/${id}/`);
  }

  createInsuranceCompany(companyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/insurancecompany/`, companyData);
  }

  updateInsuranceCompany(id: number, companyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/insurancecompany/${id}/`, companyData);
  }

  deleteInsuranceCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/insurancecompany/${id}/`);
  }

  // Insurance Type endpoints
  getInsuranceTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insurancetype/`);
  }

  getInsuranceType(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/insurancetype/${id}/`);
  }

  createInsuranceType(typeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/insurancetype/`, typeData);
  }

  updateInsuranceType(id: number, typeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/insurancetype/${id}/`, typeData);
  }

  deleteInsuranceType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/insurancetype/${id}/`);
  }

  // Customer Policy endpoints
  getCustomerPolicies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customerpolicy/`);
  }

  getCustomerPolicy(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/customerpolicy/${id}/`);
  }

  createCustomerPolicy(policyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customerpolicy/`, policyData);
  }

  updateCustomerPolicy(id: number, policyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/customerpolicy/${id}/`, policyData);
  }

  deleteCustomerPolicy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customerpolicy/${id}/`);
  }

  // Helper methods
  hasToken(): boolean {
    if (!this.isBrowser) return false;
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('user');
      // Check both flags and actual user data
      return isAuthenticated === 'true' && user !== null;
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      return isAuthenticated === 'true' ? 'authenticated' : null;
    } catch (error) {
      return null;
    }
  }

  getStoredUser(): any {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Get decoded token data
  getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  // Public method to refresh auth state (useful for page refresh scenarios)
  refreshAuthState(): void {
    if (this.isBrowser) {
      this.restoreAuthState();
    }
  }
}
