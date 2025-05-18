import { Component, ViewChild, Inject, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AccountService } from '../../services/account.service';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';

import { RoleEditorComponent } from '../role-editor/role-editor.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: 'edit-role-dialog.component.html',
  styleUrls: ['edit-role-dialog.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    RoleEditorComponent
  ]
})
export class EditRoleDialogComponent implements AfterViewInit {
  @ViewChild(RoleEditorComponent, { static: true })
  roleEditor: RoleEditorComponent;

  get roleName(): any {
    return this.data.role ? { name: this.data.role.name } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<RoleEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role, allPermissions: Permission[] },
    private accountService: AccountService
  ) {
  }

  ngAfterViewInit() {
    this.roleEditor.roleSaved$.subscribe(role => this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }
}
