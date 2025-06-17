import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AuthEnhancedService } from './auth-enhanced.service';

/**
 * HTTP Interceptor that automatically handles JWT token refresh
 * for DataManager and other API requests
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private authEnhancedService: AuthEnhancedService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Skip token handling for token endpoint itself
    if (req.url.includes('/connect/token')) {
      return next.handle(req);
    }

    // Add token to API requests
    if (this.isApiRequest(req)) {
      req = this.addTokenToRequest(req);
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private isApiRequest(req: HttpRequest<any>): boolean {
    // Check if this is an API request that needs authentication
    return req.url.includes('/api/') || 
           req.url.includes('UrlDatasource') ||
           req.url.includes(this.authService.configurations?.baseUrl || '');
  }

  private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.accessToken;
    
    if (token) {
      return req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        }
      });
    }
    
    return req;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authEnhancedService.forceTokenRefresh().pipe(
        switchMap((newToken: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken);
          
          if (newToken) {
            // Retry the original request with new token
            return next.handle(this.addTokenToRequest(req));
          }
          
          // If refresh failed, redirect to login
          this.authService.reLogin();
          return throwError('Token refresh failed');
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.reLogin();
          return throwError(error);
        })
      );
    } else {
      // Wait for token refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => next.handle(this.addTokenToRequest(req)))
      );
    }
  }
}