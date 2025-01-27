


//



import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';


interface RecoverPasswordForm {
  usernameOrEmail: FormControl<string>;
}


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  isLoading = false;
  isSuccess: boolean;

  recoverPasswordForm: FormGroup<RecoverPasswordForm>;

  @ViewChild('form')
  private form: NgForm;

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.recoverPasswordForm.setValue({
      usernameOrEmail: '',
    });
  }

  buildForm() {
    this.recoverPasswordForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required]
    });
  }

  get usernameOrEmail() { return this.recoverPasswordForm.get('usernameOrEmail'); }

  getUsernameOrEmail(): string {
    const formModel = this.recoverPasswordForm.value;
    return formModel.usernameOrEmail;
  }

  recover() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.recoverPasswordForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Generating password reset mail...');

    this.accountService.recoverPassword(this.getUsernameOrEmail())
      .subscribe({ next: _ => this.saveSuccessHelper(), error: error => this.saveFailedHelper(error) });
  }

  private saveSuccessHelper() {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = true;
    this.alertService.showMessage('Recover Password', 'Password reset email sent', MessageSeverity.success);
  }

  private saveFailedHelper(error: any) {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = false;

    const errorMessage = Utilities.getHttpResponseMessage(error);

    if (errorMessage) {
      this.alertService.showStickyMessage('Password Recovery Failed', errorMessage, MessageSeverity.error, error);
    } else {
      this.alertService.showStickyMessage('Password Recovery Failed', `An error occurred whilst recovering your password.\nError: ${Utilities.getResponseBody(error)}`, MessageSeverity.error, error);
    }
  }
}
