import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, PageSettingsModel, GridModule } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';

import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { PageHeaderComponent } from "../../shared/page-header/page-header.component";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    TextBoxModule,
    TranslateModule,
    PageHeaderComponent,
    EditRoleDialogComponent
  ],
  animations: [fadeInOut]
})
export class RoleListComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;

  dataSource: Role[] = [];
  allPermissions: Permission[] = [];
  sourceRole: Role;
  loadingIndicator: boolean;
  
  // Dialog properties
  showEditDialog: boolean = false;
  editingRole: Role | null = null;

  pageSettings: PageSettingsModel = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  };

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService
  ) { }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  ngOnInit() {
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

  private updateRoles(role: Role) {
    if (this.sourceRole) {
      Object.assign(this.sourceRole, role);
      this.alertService.showMessage('Success', `Changes to role "${role.name}" was saved successfully`, MessageSeverity.success);
      this.sourceRole = null;
    } else {
      this.dataSource.push(role);
      setTimeout(() => this.refresh(), 50);
      this.alertService.showMessage('Success', `Role "${role.name}" was created successfully`, MessageSeverity.success);
    }
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
          
          // Ensure grid refreshes with new data - use timeout to ensure grid is initialized
          setTimeout(() => {
            this.refresh();
          }, 50);
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
    this.editingRole = role || null;
    this.showEditDialog = true;
  }

  public onRoleSaved(role: Role) {
    this.updateRoles(role);
    this.showEditDialog = false;
  }

  public onDialogClosed() {
    this.showEditDialog = false;
    this.editingRole = null;
    this.sourceRole = null;
  }

  public confirmDelete(role: Role) {
    this.alertService.showDialog(
      'Delete Role',
      `Are you sure you want to delete role "${role.name}"? This action cannot be undone.`,
      DialogType.confirm,
      () => this.deleteRole(role),
      () => {}
    );
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
          setTimeout(() => this.refresh(), 50);
          this.alertService.showMessage('Success', `Role "${role.name}" was deleted successfully`, MessageSeverity.success);
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
