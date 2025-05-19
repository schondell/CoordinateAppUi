import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { GridComponent, SortService, PageService } from '@syncfusion/ej2-angular-grids';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';

import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import {PageHeaderComponent} from "../../shared/page-header/page-header.component";
import {SharedModule} from "../../shared.module";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  imports: [
    PageHeaderComponent,
    SharedModule
  ],
  animations: [fadeInOut]
})
export class RoleListComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('toast') toast: ToastComponent;

  displayedColumns = ['name', 'description', 'usersCount', 'actions'];
  dataSource: Role[] = [];
  allPermissions: Permission[] = [];
  sourceRole: Role;
  editingRoleName: { name: string };
  loadingIndicator: boolean;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private dialog: DialogComponent
  ) { }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Grid is configured with built-in sorting and paging
  }

  public applyFilter(filterValue: string) {
    if (this.grid) {
      this.grid.search(filterValue);
    }
  }

  private refresh() {
    if (this.grid) {
      this.grid.refresh();
    }
  }

  private updateRoles(role: Role) {
    if (this.sourceRole) {
      // Find and update existing role
      const index = this.dataSource.findIndex(r => r === this.sourceRole);
      if (index >= 0) {
        this.dataSource[index] = role;
      }
      this.sourceRole = null;
    } else {
      // Add new role
      this.dataSource.push(role);
    }

    // Update grid data source
    this.grid.dataSource = [...this.dataSource];
    this.refresh();
  }

  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.accountService.getRolesAndPermissions()
      .subscribe({
        next: results => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.dataSource = results[0];
          this.allPermissions = results[1];
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Load Error', `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  public editRole(role?: Role) {
    this.sourceRole = role;

    // Using Syncfusion dialog service
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      width: '500px',
      showCloseIcon: true,
      closeOnEscape: true,
      data: { role, allPermissions: this.allPermissions }
    });
    
    // Subscribe to dialog result
    dialogRef.beforeClose.subscribe(r => {
      if (r && this.canManageRoles) {
        this.updateRoles(r);
      }
    });
  }

  public confirmDelete(role: Role) {
    // Using Syncfusion toast for confirmation
    this.toast.content = `Delete ${role.name} role?`;
    this.toast.buttons = [
      { model: { content: 'DELETE', cssClass: 'e-danger' }, click: () => this.deleteRole(role) },
      { model: { content: 'CANCEL' } }
    ];
    this.toast.show();
  }

  private deleteRole(role: Role) {
    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.accountService.deleteRole(role)
      .subscribe({
        next: _ => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.dataSource = this.dataSource.filter(item => item !== role);
          this.grid.dataSource = [...this.dataSource];
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Delete Error', `An error occurred whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }
}
