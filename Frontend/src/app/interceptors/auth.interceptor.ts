import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token fresh from storage for each request
    const token = this.apiService.getToken();

    // Clone request and add authorization header if token exists
    if (token) {
      console.log('AuthInterceptor: Adding Bearer token to request:', request.url);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.warn('AuthInterceptor: No token available for request:', request.url);
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('AuthInterceptor: 401 Unauthorized for:', request.url);
          console.error('AuthInterceptor: Response:', error);
          // Token might be expired or invalid
          // You can implement token refresh logic here if needed
          // For now, just pass the error
        }
        return throwError(() => error);
      })
    );
  }
}
