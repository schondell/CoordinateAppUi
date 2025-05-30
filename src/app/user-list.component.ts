import { Component, OnInit, AfterViewInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity } from '../../services/alert.service';
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
  animations: [fadeInOut],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule
  ]
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['jobTitle', 'userName', 'fullName', 'email'];
  dataSource: MatTableDataSource<User>;
  sourceUser: User;
  loadingIndicator: boolean;
  allRoles: Role[] = [];

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {


    if (this.canManageUsers) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  private updateUsers(user: User) {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, user);
      this.alertService.showMessage('Success', `Changes to user \"${user.userName}\" was saved successfully`, MessageSeverity.success);
      this.sourceUser = null;
    } else {
      this.dataSource.data.push(user);
      this.refresh();
      this.alertService.showMessage('Success', `User \"${user.userName}\" was created successfully`, MessageSeverity.success);
    }
  }

  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles().subscribe({
        next: results => this.onDataLoadSuccessful(results[0], results[1]),
        error: error => this.onDataLoadFailed(error)
      });
    } else {
      this.accountService.getUsers().subscribe({
        next: users => this.onDataLoadSuccessful(users, this.accountService.currentUser.roles.map(r => new Role(r))),
        error: error => this.onDataLoadFailed(error)
      });
    }
  }

  private onDataLoadSuccessful(users: User[], roles: Role[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.dataSource.data = users;
    this.allRoles = roles;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  public editUser(user?: User) {
    this.sourceUser = user;

    const dialogRef = this.dialog.open(EditUserDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { user, roles: [...this.allRoles] }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        this.updateUsers(u);
      }
    });
  }

  public confirmDelete(user: User) {
    this.snackBar.open(`Delete ${user.userName}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.accountService.deleteUser(user)
          .subscribe({
            next: _ => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.dataSource.data = this.dataSource.data.filter(item => item !== user);
            },
            error: error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.alertService.showStickyMessage('Delete Error', `An error occurred whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            }
          });
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
