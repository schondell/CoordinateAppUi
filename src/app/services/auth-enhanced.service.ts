import { Injectable } from '@angular/core';
import { Observable, Subject, timer, switchMap, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtHelper } from './jwt-helper';

/**
 * Enhanced authentication service that provides token refresh capabilities
 * and notifications for DataManager integration
 */
@Injectable({
  providedIn: 'root'
})
export class AuthEnhancedService {
  private tokenRefreshSubject = new Subject<string>();
  private tokenRefreshTimer: any;
  
  constructor(
    private authService: AuthService,
    private jwtHelper: JwtHelper
  ) {
    this.setupTokenRefreshScheduler();
  }

  /**
   * Get the current access token
   */
  get accessToken(): string {
    return this.authService.accessToken;
  }

  /**
   * Check if token is expired or will expire soon
   */
  isTokenExpiringSoon(offsetMinutes: number = 5): boolean {
    const token = this.accessToken;
    if (!token) return true;

    return this.jwtHelper.isTokenExpired(token, offsetMinutes * 60);
  }

  /**
   * Proactively refresh token before it expires
   */
  refreshTokenIfNeeded(): Observable<string> {
    if (this.isTokenExpiringSoon()) {
      return this.authService.refreshLogin().pipe(
        switchMap(user => {
          const newToken = this.authService.accessToken;
          this.tokenRefreshSubject.next(newToken);
          return of(newToken);
        }),
        catchError(error => {
          console.error('Token refresh failed:', error);
          this.authService.reLogin();
          return of(null);
        })
      );
    }
    
    return of(this.accessToken);
  }

  /**
   * Setup automatic token refresh scheduler
   */
  private setupTokenRefreshScheduler(): void {
    // Check token expiry every 2 minutes
    this.tokenRefreshTimer = timer(0, 2 * 60 * 1000).subscribe(() => {
      if (this.authService.isLoggedIn && this.isTokenExpiringSoon(10)) {
        console.log('Token expiring soon, refreshing...');
        this.refreshTokenIfNeeded().subscribe();
      }
    });
  }

  /**
   * Get observable for token refresh events
   */
  getTokenRefreshEvent(): Observable<string> {
    return this.tokenRefreshSubject.asObservable();
  }

  /**
   * Generate headers with current token
   */
  getAuthHeaders(): { [key: string]: string }[] {
    const token = this.accessToken;
    
    if (token) {
      return [
        { 'Authorization': `Bearer ${token}` },
        { 'Content-Type': 'application/json' },
        { 'Accept': 'application/json, text/plain, */*' }
      ];
    }
    
    return [
      { 'Content-Type': 'application/json' },
      { 'Accept': 'application/json, text/plain, */*' }
    ];
  }

  /**
   * Force token refresh and notify all subscribers
   */
  forceTokenRefresh(): Observable<string> {
    return this.authService.refreshLogin().pipe(
      switchMap(user => {
        const newToken = this.authService.accessToken;
        this.tokenRefreshSubject.next(newToken);
        return of(newToken);
      }),
      catchError(error => {
        console.error('Forced token refresh failed:', error);
        return of(null);
      })
    );
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    if (this.tokenRefreshTimer) {
      this.tokenRefreshTimer.unsubscribe();
    }
  }
}