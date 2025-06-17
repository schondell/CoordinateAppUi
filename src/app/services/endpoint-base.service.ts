import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, from, throwError, EMPTY } from 'rxjs';
import { mergeMap, switchMap, catchError, delay } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class EndpointBase {

  private taskPauser: Subject<any>;
  private isRefreshingLogin: boolean;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService,
    protected router?: Router) {
  }

  protected get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    });

    return { headers };
  }

  public refreshLogin() {
    return this.authService.refreshLogin().pipe(
      catchError(error => {
        return this.handleError(error, () => this.refreshLogin());
      }));
  }

  protected handleError(error, continuation: () => Observable<any>) {
    console.log(`⚠️ EndpointBase handling error:`, error.status, error.message);

    // Handle authentication errors (401 Unauthorized)
    if (error.status === 401) {
      return this.handleAuthenticationError(error, continuation);
    }

    // Handle invalid grant errors (refresh token expired)
    if (error.error && error.error.error === 'invalid_grant') {
      console.log('❌ Invalid grant error - refresh token expired');
      this.handleSessionExpiry('Refresh token expired');
      return throwError(() => new Error('Session expired - please log in again'));
    }

    // Handle other errors normally
    return throwError(() => error);
  }

  /**
   * Handle 401 authentication errors with intelligent retry logic
   */
  private handleAuthenticationError(error: any, continuation: () => Observable<any>): Observable<any> {
    // If we're already refreshing, queue this request
    if (this.isRefreshingLogin) {
      console.log('🔄 Token refresh in progress, queuing request...');
      return this.pauseTask(continuation);
    }

    // Check if we have a refresh token
    if (!this.authService.refreshToken) {
      console.log('❌ No refresh token available');
      this.handleSessionExpiry('No refresh token');
      return throwError(() => new Error('Session expired - please log in again'));
    }

    // Attempt token refresh
    console.log('🔄 Attempting token refresh due to 401 error...');
    this.isRefreshingLogin = true;

    return from(this.authService.refreshLogin()).pipe(
      mergeMap(user => {
        this.isRefreshingLogin = false;
        this.resumeTasks(true);
        
        if (user) {
          console.log('✅ Token refresh successful, retrying original request');
          return continuation();
        } else {
          console.log('❌ Token refresh returned no user');
          this.handleSessionExpiry('Token refresh failed');
          return throwError(() => new Error('Session expired - please log in again'));
        }
      }),
      catchError(refreshError => {
        this.isRefreshingLogin = false;
        this.resumeTasks(false);
        
        console.error('❌ Token refresh failed:', refreshError);
        
        // Determine if this is a session expiry or server error
        if (refreshError.status === 401 || 
            (refreshError.error && refreshError.error.error === 'invalid_grant')) {
          this.handleSessionExpiry('Token refresh authentication failed');
          return throwError(() => new Error('Session expired - please log in again'));
        } else {
          // Server error during refresh - don't logout, but return error
          console.log('⚠️ Server error during token refresh, not logging out');
          return throwError(() => refreshError);
        }
      })
    );
  }

  /**
   * Handle session expiry by logging out and redirecting
   */
  private handleSessionExpiry(reason: string): void {
    console.log(`🚪 Session expired: ${reason}`);
    
    // Logout user and clear tokens
    this.authService.logout();
    
    // Redirect to login if router is available
    if (this.router) {
      // Add a small delay to prevent multiple rapid redirects
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 100);
    } else {
      // Fallback: use auth service redirect
      this.authService.redirectForLogin();
    }
  }

  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const token = this.authService.accessToken;
    
    if (!token) {
      console.warn('⚠️ No access token available for request');
    }
    
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      })
    };
  }

  private pauseTask(continuation: () => Observable<any>) {
    if (!this.taskPauser) {
      this.taskPauser = new Subject();
    }

    return this.taskPauser.pipe(switchMap(continueOp => {
      return continueOp ? continuation() : throwError(() => new Error('session expired'));
    }));
  }

  private resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }
}
