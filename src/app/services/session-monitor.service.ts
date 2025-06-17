import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, interval, timer, Subscription, NEVER } from 'rxjs';
import { switchMap, take, catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AlertService, MessageSeverity } from './alert.service';
import { User } from '../models/user.model';

export interface SessionConfig {
  /** Time in minutes before token expiry to attempt refresh */
  refreshBeforeExpiry: number;
  /** Time in minutes of inactivity before showing warning */
  inactivityWarningTime: number;
  /** Time in minutes of inactivity before auto logout */
  inactivityLogoutTime: number;
  /** Interval in seconds to check session status */
  checkInterval: number;
  /** Show session expiry warnings to user */
  showWarnings: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SessionMonitorService implements OnDestroy {
  
  private readonly defaultConfig: SessionConfig = {
    refreshBeforeExpiry: 5, // Refresh 5 minutes before expiry
    inactivityWarningTime: 25, // Warn after 25 minutes of inactivity
    inactivityLogoutTime: 30, // Logout after 30 minutes of inactivity
    checkInterval: 30, // Check every 30 seconds
    showWarnings: true
  };

  private config: SessionConfig;
  private sessionSubscription?: Subscription;
  private lastActivity: Date = new Date();
  private warningShown = false;
  
  private sessionStatus$ = new BehaviorSubject<'active' | 'warning' | 'expired'>('active');
  private timeUntilExpiry$ = new BehaviorSubject<number>(0);

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.config = { ...this.defaultConfig };
    this.setupActivityTracking();
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
    this.removeActivityListeners();
  }

  /**
   * Start monitoring the user session
   */
  startMonitoring(customConfig?: Partial<SessionConfig>): void {
    if (customConfig) {
      this.config = { ...this.defaultConfig, ...customConfig };
    }

    this.stopMonitoring(); // Stop any existing monitoring
    
    if (!this.authService.isLoggedIn) {
      return;
    }

    console.log('🔐 Starting session monitoring with config:', this.config);

    this.sessionSubscription = interval(this.config.checkInterval * 1000)
      .pipe(
        switchMap(() => this.checkSession()),
        catchError(error => {
          console.error('Session monitoring error:', error);
          return NEVER; // Continue monitoring even on errors
        })
      )
      .subscribe();
  }

  /**
   * Stop monitoring the user session
   */
  stopMonitoring(): void {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
      this.sessionSubscription = undefined;
    }
    this.warningShown = false;
    this.sessionStatus$.next('active');
  }

  /**
   * Update user activity timestamp
   */
  updateActivity(): void {
    this.lastActivity = new Date();
    
    // Reset warning if user becomes active again
    if (this.warningShown) {
      this.warningShown = false;
      this.sessionStatus$.next('active');
      this.alertService.resetStickyMessage();
    }
  }

  /**
   * Get current session status
   */
  getSessionStatus(): Observable<'active' | 'warning' | 'expired'> {
    return this.sessionStatus$.asObservable();
  }

  /**
   * Get time until token expiry in minutes
   */
  getTimeUntilExpiry(): Observable<number> {
    return this.timeUntilExpiry$.asObservable();
  }

  /**
   * Manually refresh the authentication token
   */
  refreshToken(): Observable<boolean> {
    console.log('🔄 Manually refreshing authentication token...');
    
    return this.authService.refreshLogin().pipe(
      take(1),
      tap(user => {
        if (user) {
          console.log('✅ Token refreshed successfully for user:', (user as User).userName);
          this.updateActivity();
          this.sessionStatus$.next('active');
        }
      }),
      switchMap(() => [true]),
      catchError(error => {
        console.error('❌ Token refresh failed:', error);
        this.handleSessionExpiry('Token refresh failed');
        return [false];
      })
    );
  }

  /**
   * Check current session status and handle expiry/refresh
   */
  private checkSession(): Observable<void> {
    const now = new Date();
    
    if (!this.authService.isLoggedIn) {
      this.sessionStatus$.next('expired');
      return NEVER;
    }

    // Check token expiry
    const tokenExpiryDate = this.authService.accessTokenExpiryDate;
    if (!tokenExpiryDate || this.authService.isSessionExpired) {
      this.handleSessionExpiry('Token expired');
      return NEVER;
    }

    // Calculate time until expiry
    const timeUntilExpiry = Math.max(0, Math.floor((tokenExpiryDate.getTime() - now.getTime()) / (1000 * 60)));
    this.timeUntilExpiry$.next(timeUntilExpiry);

    // Check if token needs refresh
    if (timeUntilExpiry <= this.config.refreshBeforeExpiry) {
      console.log(`🔄 Token expires in ${timeUntilExpiry} minutes, attempting refresh...`);
      return this.performTokenRefresh();
    }

    // Check user inactivity
    const inactiveMinutes = Math.floor((now.getTime() - this.lastActivity.getTime()) / (1000 * 60));
    
    if (inactiveMinutes >= this.config.inactivityLogoutTime) {
      this.handleSessionExpiry('Session timeout due to inactivity');
      return NEVER;
    }

    if (inactiveMinutes >= this.config.inactivityWarningTime && !this.warningShown && this.config.showWarnings) {
      this.showInactivityWarning(this.config.inactivityLogoutTime - inactiveMinutes);
    }

    return NEVER;
  }

  /**
   * Perform automatic token refresh
   */
  private performTokenRefresh(): Observable<void> {
    return this.authService.refreshLogin().pipe(
      take(1),
      tap(user => {
        if (user) {
          console.log('✅ Auto token refresh successful for user:', (user as User).userName);
          this.sessionStatus$.next('active');
        }
      }),
      switchMap(() => NEVER),
      catchError(error => {
        console.error('❌ Auto token refresh failed:', error);
        this.handleSessionExpiry('Automatic token refresh failed');
        return NEVER;
      })
    );
  }

  /**
   * Show inactivity warning to user
   */
  private showInactivityWarning(minutesLeft: number): void {
    this.warningShown = true;
    this.sessionStatus$.next('warning');
    
    if (this.config.showWarnings) {
      this.alertService.showStickyMessage(
        'Session Warning',
        `You will be logged out in ${minutesLeft} minutes due to inactivity. Click anywhere to stay logged in.`,
        MessageSeverity.warn
      );
    }
  }

  /**
   * Handle session expiry by logging out and redirecting
   */
  private handleSessionExpiry(reason: string): void {
    console.log(`🚪 Session expired: ${reason}`);
    
    this.sessionStatus$.next('expired');
    this.stopMonitoring();
    
    // Clear any existing alerts
    this.alertService.resetStickyMessage();
    
    // Logout and redirect to login
    this.authService.logout();
    
    // Show a brief message before redirect
    this.alertService.showMessage(
      'Session Expired',
      'Your session has expired. Please log in again.',
      MessageSeverity.info
    );
    
    // Redirect to login after a short delay
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  /**
   * Setup activity tracking to detect user interaction
   */
  private setupActivityTracking(): void {
    // List of events that constitute user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Throttle activity updates to avoid excessive calls
    let throttleTimeout: any;
    
    const updateActivityThrottled = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        this.updateActivity();
        throttleTimeout = null;
      }, 5000); // Update at most every 5 seconds
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivityThrottled, true);
    });

    // Store references for cleanup
    this.activityCleanup = () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivityThrottled, true);
      });
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }

  private activityCleanup?: () => void;

  /**
   * Remove activity event listeners
   */
  private removeActivityListeners(): void {
    if (this.activityCleanup) {
      this.activityCleanup();
    }
  }

  /**
   * Get session configuration
   */
  getConfig(): SessionConfig {
    return { ...this.config };
  }

  /**
   * Update session configuration
   */
  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('📋 Session config updated:', this.config);
  }
}