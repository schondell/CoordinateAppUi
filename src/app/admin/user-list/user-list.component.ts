import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, PageSettingsModel, GridModule } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';

import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    TextBoxModule,
    DialogModule,
    TranslateModule,
    PageHeaderComponent,
    EditUserDialogComponent
  ],
  animations: [fadeInOut]
})
export class UserListComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;

  dataSource: User[] = [];
  sourceUser: User;
  loadingIndicator: boolean;
  allRoles: Role[] = [];
  
  // Dialog properties
  showEditDialog: boolean = false;
  editingUser: User | null = null;
  
  pageSettings: PageSettingsModel = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  };

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService) {
  }

  ngOnInit() {
    // Debug logging to see what's happening
    console.log('=== USER LIST COMPONENT DEBUG ===');
    console.log('Current user:', this.accountService.currentUser);
    console.log('User permissions:', this.accountService.permissions);
    console.log('canManageUsers:', this.canManageUsers);
    console.log('Permission.manageUsersPermission value:', Permission.manageUsersPermission);
    console.log('userHasPermission check:', this.accountService.userHasPermission(Permission.manageUsersPermission));
    this.loadData();
  }

  public applyFilter(filterValue: string) {
    if (this.grid) {
      this.grid.search(filterValue);
    }
  }

  private refresh() {
    if (this.grid && this.grid.element) {
      try {
        this.grid.refresh();
      } catch (error) {
        console.warn('Grid refresh failed, will retry after delay:', error);
        setTimeout(() => {
          if (this.grid && this.grid.element) {
            this.grid.refresh();
          }
        }, 100);
      }
    }
  }

  private updateUsers(user: User) {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, user);
      this.alertService.showMessage('Success', `Changes to user \"${user.userName}\" was saved successfully`, MessageSeverity.success);
      this.sourceUser = null;
    } else {
      this.dataSource.push(user);
      setTimeout(() => this.refresh(), 50);
      this.alertService.showMessage('Success', `User \"${user.userName}\" was created successfully`, MessageSeverity.success);
    }
  }

  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    // Try to load users and roles, but fallback to just users if roles endpoint fails
    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles().subscribe({
        next: results => this.onDataLoadSuccessful(results[0], results[1]),
        error: error => {
          console.warn('Failed to load users and roles, trying users only:', error);
          // Fallback: try to load just users
          this.loadUsersOnly();
        }
      });
    } else {
      this.loadUsersOnly();
    }
  }

  private loadUsersOnly() {
    this.accountService.getUsers().subscribe({
      next: users => this.onDataLoadSuccessful(users, []), // Empty roles array
      error: error => this.onDataLoadFailed(error)
    });
  }

  private onDataLoadSuccessful(users: User[], roles: Role[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.dataSource = users;
    this.allRoles = roles;
    
    // Ensure grid refreshes with new data - use timeout to ensure grid is initialized
    setTimeout(() => {
      this.refresh();
    }, 50);
    
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  public editUser(user?: User) {
    this.sourceUser = user;
    this.editingUser = user || null;
    this.showEditDialog = true;
  }

  public onUserSaved(user: User) {
    this.updateUsers(user);
    this.showEditDialog = false;
  }

  public onDialogClosed() {
    this.showEditDialog = false;
    this.editingUser = null;
    this.sourceUser = null;
  }

  public confirmDelete(user: User) {
    this.alertService.showDialog(
      'Delete User',
      `Are you sure you want to delete user "${user.userName}"? This action cannot be undone.`,
      DialogType.confirm,
      () => this.deleteUser(user),
      () => {}
    );
  }

  private deleteUser(user: User) {
    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.accountService.deleteUser(user)
      .subscribe({
        next: _ => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.dataSource = this.dataSource.filter(item => item !== user);
          setTimeout(() => this.refresh(), 50);
          this.alertService.showMessage('Success', `User "${user.userName}" was deleted successfully`, MessageSeverity.success);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Delete Error', `An error occurred whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  get canManageUsers() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }
}
