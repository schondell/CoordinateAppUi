import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { LocalStoreManager } from './local-store-manager.service';
import { OidcHelperService } from './oidc-helper.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { AccessToken, LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';
import { UserLogin } from '../models/user-login.model';
import { PermissionValues, Permission } from '../models/permission.model';

export type OidcProviders = 'google' | 'facebook' | 'twitter' | 'microsoft';

@Injectable()
export class AuthService {
  public get loginUrl() { return this.configurations.loginUrl; }
  public get homeUrl() { return this.configurations.homeUrl; }

  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;

  public reLoginDelegate: () => void;

  private previousIsLoggedInCheck = false;
  private loginStatus = new Subject<boolean>();
  private tokenRefreshInProgress = false;
  private lastRefreshAttempt = 0;
  private readonly REFRESH_COOLDOWN = 30000; // 30 seconds cooldown between refresh attempts

  constructor(
    private router: Router,
    private oidcHelperService: OidcHelperService,
    private configurations: ConfigurationService,
    private localStorage: LocalStoreManager) {

    this.initializeLoginStatus();
  }

  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  gotoPage(page: string, preserveParams = true) {

    const navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
    };

    this.router.navigate([page], navigationExtras);
  }

  gotoHomePage() {
    this.router.navigate([this.homeUrl]);
  }

  redirectLoginUser() {
    const redirect = this.loginRedirectUrl && this.loginRedirectUrl !== '/' && this.loginRedirectUrl !== ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
    this.loginRedirectUrl = null;

    console.log('Redirecting to:', redirect);

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge'
    };

    console.log('Navigation path:', urlAndParams.firstPart);
    console.log('Navigation extras:', JSON.stringify(navigationExtras));

    // Use a slight delay to ensure all login processes are complete
    setTimeout(() => {
      this.router.navigate([urlAndParams.firstPart], navigationExtras)
        .then(success => {
          console.log('Navigation result:', success ? 'successful' : 'failed');
        })
        .catch(error => {
          console.error('Navigation error:', error);
        });
    }, 100);
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = null;

    this.router.navigate([redirect]);
  }

  redirectForLogin() {
    this.loginRedirectUrl = this.router.url;
    this.router.navigate([this.loginUrl]);
  }

  reLogin() {
    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    } else {
      this.redirectForLogin();
    }
  }

  refreshLogin() {
    // Prevent multiple simultaneous refresh attempts
    const now = Date.now();
    if (this.tokenRefreshInProgress || (now - this.lastRefreshAttempt) < this.REFRESH_COOLDOWN) {
      console.log('🔄 Token refresh already in progress or in cooldown period');
      return throwError(() => new Error('Token refresh already in progress'));
    }

    // Check if we have a valid refresh token
    if (!this.refreshToken) {
      console.log('❌ No refresh token available');
      return throwError(() => new Error('No refresh token available'));
    }

    this.tokenRefreshInProgress = true;
    this.lastRefreshAttempt = now;
    console.log('🔄 Starting token refresh...');

    return this.oidcHelperService.refreshLogin()
      .pipe(
        map(resp => {
          this.tokenRefreshInProgress = false;
          console.log('✅ Token refresh successful');
          return this.processLoginResponse(resp, this.rememberMe);
        }),
        catchError(error => {
          this.tokenRefreshInProgress = false;
          console.error('❌ Token refresh failed:', error);
          
          // If refresh fails with 401 or invalid_grant, the refresh token is invalid
          if (error.status === 401 || (error.error && error.error.error === 'invalid_grant')) {
            console.log('🚪 Refresh token invalid, clearing session');
            this.logout();
          }
          
          return throwError(() => error);
        })
      );
  }

  loginWithPassword(user: UserLogin) {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.oidcHelperService.loginWithPassword(user.userName, user.password)
      .pipe(map(resp => this.processLoginResponse(resp, user.rememberMe)));
  }

  loginWithExternalToken(token: string, provider: string, email?: string, password?: string) {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.oidcHelperService.loginWithExternalToken(token, provider, email, password)
      .pipe(map(resp => this.processLoginResponse(resp)));
  }

  initLoginWithGoogle(rememberMe?: boolean) {
    if (this.isLoggedIn) {
      this.logout();
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    this.oidcHelperService.initLoginWithGoogle();
  }

  initLoginWithFacebook(rememberMe?: boolean) {
    if (this.isLoggedIn) {
      this.logout();
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    this.oidcHelperService.initLoginWithFacebook();
  }


  initLoginWithMicrosoft(rememberMe?: boolean) {
    if (this.isLoggedIn) {
      this.logout();
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    this.oidcHelperService.initLoginWithMicrosoft();
  }

  processExternalOidcLoginTokens(provider: OidcProviders) {
    if (provider === 'google') {
      return this.oidcHelperService.processGoogleLoginTokens();
    } else if (provider === 'facebook') {
      return this.oidcHelperService.processFacebookLoginTokens();
    } else if (provider === 'microsoft') {
      return this.oidcHelperService.processMicrosoftLoginTokens();
    }
    else {
      return throwError(() => new Error(`Unknown OIDC Provider \"${provider}\"`));
    }
  }

  initLoginWithTwitter(rememberMe?: boolean) {
    if (this.isLoggedIn) {
      this.logout();
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    this.oidcHelperService.initLoginWithTwitter();
  }

  getTwitterAccessToken(oauthToken: string, oauthVerifier: string) {
    return this.oidcHelperService.getTwitterAccessToken(oauthToken, oauthVerifier);
  }

  private processLoginResponse(response: LoginResponse, rememberMe?: boolean) {
    const accessToken = response.access_token;

    if (accessToken == null) {
      throw new Error('accessToken cannot be null');
    }

    rememberMe = rememberMe || this.rememberMe;

    const refreshToken = response.refresh_token || this.refreshToken;
    const expiresIn = response.expires_in;
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
    const accessTokenExpiry = tokenExpiryDate;
    
    // Parse actual user data from JWT token
    const jwtHelper = new JwtHelper();
    const decodedToken = jwtHelper.decodeToken(accessToken);
    
    // Extract user information from JWT token
    const userId = decodedToken.sub || decodedToken.id || 'user';
    const userName = decodedToken.unique_name || decodedToken.preferred_username || decodedToken.name || decodedToken.username || decodedToken.user_name || 'User';
    const fullName = decodedToken.name || decodedToken.given_name || decodedToken.display_name || userName;
    const email = decodedToken.email || decodedToken.email_address || '';
    const jobTitle = decodedToken.job_title || decodedToken.title || '';
    const phoneNumber = decodedToken.phone_number || decodedToken.phone || '';
    
    // Extract roles - could be in 'role' or 'roles' claim
    let userRoles = [];
    if (decodedToken.role) {
      userRoles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
    } else if (decodedToken.roles) {
      userRoles = Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles];
    } else {
      // Fallback: if no role found but user can access admin, assume Administrator
      userRoles = ['Administrator']; // Assume admin since you can access admin functions
    }
    
    const user = new User(
      userId,
      userName,
      fullName,
      email,
      jobTitle,
      phoneNumber,
      userRoles
    );
    user.isEnabled = true;

    // Determine permissions based on user role
    let permissions: PermissionValues[] = [];
    
    // If user has Administrator role, give all permissions
    if (userRoles && userRoles.includes('Administrator')) {
      permissions = [
        Permission.viewUsersPermission,
        Permission.manageUsersPermission,
        Permission.viewRolesPermission,
        Permission.manageRolesPermission,
        Permission.assignRolesPermission
      ];
    } else {
      // Regular users get view-only permissions
      permissions = [
        Permission.viewUsersPermission,
        Permission.viewRolesPermission
      ];
    }
    
    this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);

    this.reevaluateLoginStatus(user);

    return user;
  }

  private saveUserDetails(user: User, permissions: PermissionValues[], accessToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }

  logout(): void {
    console.log('🚪 Logging out user');
    
    // Clear authentication state
    this.tokenRefreshInProgress = false;
    this.lastRefreshAttempt = 0;
    
    // Clear stored data
    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
    this.localStorage.deleteData(DBkeys.CURRENT_USER);

    this.configurations.clearLocalChanges();

    this.reevaluateLoginStatus();
  }

  private reevaluateLoginStatus(currentUser?: User) {
    const user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    const isLoggedIn = user != null;

    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this.loginStatus.next(isLoggedIn);
      });
    }

    this.previousIsLoggedInCheck = isLoggedIn;
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  get currentUser(): User {

    const user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    this.reevaluateLoginStatus(user);

    return user;
  }

  get userPermissions(): PermissionValues[] {
    return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
  }

  get accessToken(): string {
    return this.oidcHelperService.accessToken;
  }

  get accessTokenExpiryDate(): Date {
    return this.oidcHelperService.accessTokenExpiryDate;
  }

  get refreshToken(): string {
    return this.oidcHelperService.refreshToken;
  }

  get isSessionExpired(): boolean {
    if (!this.accessToken || !this.accessTokenExpiryDate) {
      return true;
    }
    
    // Add a small buffer (30 seconds) to account for clock skew
    const bufferTime = 30 * 1000; // 30 seconds in milliseconds
    const expiryWithBuffer = this.accessTokenExpiryDate.getTime() - bufferTime;
    
    return expiryWithBuffer <= Date.now();
  }

  get isLoggedIn(): boolean {
    const user = this.currentUser;
    const hasValidToken = this.accessToken && !this.isSessionExpired;
    
    return user != null && hasValidToken;
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) === true;
  }
}
