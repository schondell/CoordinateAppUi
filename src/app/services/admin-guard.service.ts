import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private accountService: AccountService, 
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkAdminPermissions(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(): boolean {
    return this.checkAdminPermissions('/admin');
  }

  private checkAdminPermissions(url: string): boolean {
    // Check if user is logged in first
    if (!this.accountService.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has admin permissions (either manage users or manage roles)
    const hasAdminPermissions = this.accountService.userHasPermission(Permission.manageUsersPermission) ||
                               this.accountService.userHasPermission(Permission.manageRolesPermission) ||
                               this.accountService.userHasPermission(Permission.viewUsersPermission) ||
                               this.accountService.userHasPermission(Permission.viewRolesPermission);

    if (!hasAdminPermissions) {
      console.warn('Access denied: User does not have admin permissions');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  // Utility method to check if user should see admin menu
  canViewAdminMenu(): boolean {
    if (!this.accountService.currentUser) {
      return false;
    }

    return this.accountService.userHasPermission(Permission.manageUsersPermission) ||
           this.accountService.userHasPermission(Permission.manageRolesPermission) ||
           this.accountService.userHasPermission(Permission.viewUsersPermission) ||
           this.accountService.userHasPermission(Permission.viewRolesPermission);
  }
}