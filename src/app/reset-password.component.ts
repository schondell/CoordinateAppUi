

//



import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { EqualValidator } from '../../shared/validators/equal.validator';


interface ResetPasswordForm {
  usernameOrEmail: FormControl<string>;
  password: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
}


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false;
  isSuccess: boolean;
  resetCode: string;

  resetPasswordForm: FormGroup<ResetPasswordForm>;

  @ViewChild('form')
  private form: NgForm;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService,
    private accountService: AccountService,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.resetPasswordForm.setValue({
      usernameOrEmail: '',
      password: {
        newPassword: '',
        confirmPassword: ''
      }
    });

    this.route.queryParams.subscribe(params => {
      const loweredParams: any = Utilities.GetObjectWithLoweredPropertyNames(params);
      this.resetCode = loweredParams.code;

      if (!this.resetCode) {
        this.authService.gotoHomePage();
      }
    });
  }

  buildForm() {
    this.resetPasswordForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: this.formBuilder.group({
        newPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
      })
    });
  }

  get usernameOrEmail() { return this.resetPasswordForm.get('usernameOrEmail'); }
  get newPassword() { return this.resetPasswordForm.get('password').get('newPassword'); }
  get confirmPassword() { return this.resetPasswordForm.get('password').get('confirmPassword'); }

  getUsernameOrEmail(): string {
    const formModel = this.resetPasswordForm.value;
    return formModel.usernameOrEmail;
  }

  getNewPassword(): string {
    const formModel = this.resetPasswordForm.value;
    return formModel.password.newPassword;
  }

  resetPassword() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.resetPasswordForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Resetting password...');

    this.accountService.resetPassword(this.getUsernameOrEmail(), this.getNewPassword(), this.resetCode)
      .subscribe({ next: _ => this.saveSuccessHelper(), error: error => this.saveFailedHelper(error) });
  }

  private saveSuccessHelper() {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = true;
    this.alertService.showMessage('Password Change', 'Your password was successfully reset', MessageSeverity.success);
    this.authService.logout();
  }

  private saveFailedHelper(error: any) {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = false;

    const errorMessage = Utilities.getHttpResponseMessage(error);

    if (errorMessage) {
      this.alertService.showStickyMessage('Password Reset Failed', errorMessage, MessageSeverity.error, error);
    } else {
      this.alertService.showStickyMessage('Password Reset Failed', `An error occurred whilst resetting your password.\nError: ${Utilities.getResponseBody(error)}`, MessageSeverity.error, error);
    }
  }
}
