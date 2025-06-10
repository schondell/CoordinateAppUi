import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from '../../services/account.service';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { RoleEditorComponent } from '../role-editor/role-editor.component';

@Component({
    selector: 'app-edit-role-dialog',
    templateUrl: 'edit-role-dialog.component.html',
    styleUrls: ['edit-role-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TranslateModule,
        RoleEditorComponent
    ]
})
export class EditRoleDialogComponent implements AfterViewInit {
  @ViewChild(RoleEditorComponent, { static: true })
  roleEditor: RoleEditorComponent;

  @Input() role: Role | null = null;
  @Input() allPermissions: Permission[] = [];
  @Input() visible: boolean = false;
  @Output() roleSaved = new EventEmitter<Role>();
  @Output() dialogClosed = new EventEmitter<void>();

  get roleName(): any {
    return this.role ? { name: this.role.name } : null;
  }

  constructor(private accountService: AccountService) {
  }

  ngAfterViewInit() {
    if (this.roleEditor) {
      this.roleEditor.roleSaved$.subscribe(role => {
        this.roleSaved.emit(role);
        this.close();
      });
    }
  }

  close(): void {
    this.visible = false;
    this.dialogClosed.emit();
  }

  saveRole(): void {
    if (this.roleEditor) {
      this.roleEditor.save();
    }
  }

  cancel(): void {
    this.close();
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }
}
