import { Component, ViewChild, Inject, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';

import { UserEditorComponent } from '../user-editor/user-editor.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: 'edit-user-dialog.component.html',
  styleUrls: ['edit-user-dialog.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    UserEditorComponent,
    TranslateModule
  ]
})
export class EditUserDialogComponent implements AfterViewInit {
  @ViewChild(UserEditorComponent, { static: true })
  editUser: UserEditorComponent;

  get userName(): any {
    return this.data.user ? { name: this.data.user.userName } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, roles: Role[] }) {
  }

  ngAfterViewInit() {
    this.editUser.userSaved$.subscribe(user => this.dialogRef.close(user));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
