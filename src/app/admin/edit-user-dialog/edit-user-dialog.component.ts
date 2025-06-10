import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { UserEditorComponent } from '../user-editor/user-editor.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: 'edit-user-dialog.component.html',
  styleUrls: ['edit-user-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    UserEditorComponent
  ]
})
export class EditUserDialogComponent implements AfterViewInit {
  @ViewChild(UserEditorComponent, { static: true })
  editUser: UserEditorComponent;

  @Input() user: User | null = null;
  @Input() roles: Role[] = [];
  @Input() visible: boolean = false;
  @Output() userSaved = new EventEmitter<User>();
  @Output() dialogClosed = new EventEmitter<void>();

  get userName(): any {
    return this.user ? { name: this.user.userName } : null;
  }

  ngAfterViewInit() {
    if (this.editUser) {
      this.editUser.userSaved$.subscribe(user => {
        this.userSaved.emit(user);
        this.close();
      });
    }
  }

  close(): void {
    this.visible = false;
    this.dialogClosed.emit();
  }

  saveUser(): void {
    if (this.editUser) {
      this.editUser.save();
    }
  }

  cancel(): void {
    this.close();
  }
}
