import { Component, ViewChild, Inject, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { LoginControlComponent } from './login-control.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    LoginControlComponent
  ]
})
export class LoginDialogComponent implements AfterViewInit {
  @ViewChild(LoginControlComponent, { static: true })
  loginControl: LoginControlComponent;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit() {
    this.loginControl.modalClosedCallback = () => this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
