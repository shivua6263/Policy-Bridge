import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is logged in
    const isLoggedIn = this.apiService.isLoggedIn();
    console.log('AuthGuard: Checking authentication for route:', state.url);
    console.log('AuthGuard: isLoggedIn =', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    }

    // User not authenticated, redirect to login
    console.warn('AuthGuard: User not authenticated, redirecting to login');
    console.warn('AuthGuard: Current state URL:', state.url);
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
