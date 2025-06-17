import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> | boolean {
    console.log(`🛡️ AuthGuard checking access to: ${url}`);

    // Quick check for obviously unauthenticated users
    if (!this.authService.currentUser || !this.authService.accessToken) {
      console.log('❌ No user or token found, redirecting to login');
      this.redirectToLogin(url);
      return false;
    }

    // Check if session is expired
    if (this.authService.isSessionExpired) {
      console.log('⏰ Session expired, attempting token refresh...');
      
      // Try to refresh the token
      return this.authService.refreshLogin().pipe(
        map(user => {
          if (user) {
            console.log('✅ Token refreshed successfully, allowing access');
            return true;
          } else {
            console.log('❌ Token refresh failed, redirecting to login');
            this.redirectToLogin(url);
            return false;
          }
        }),
        catchError(error => {
          console.log('❌ Token refresh error, redirecting to login:', error.message);
          this.redirectToLogin(url);
          return of(false);
        })
      );
    }

    // User is authenticated and token is valid
    console.log('✅ User authenticated, allowing access');
    return true;
  }

  private redirectToLogin(url: string): void {
    console.log(`🔄 Redirecting to login, will return to: ${url}`);
    this.authService.loginRedirectUrl = url;
    this.router.navigate(['/login']);
  }
}
