import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, NgForm, Validators } from '@angular/forms';

// Services
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';

// Syncfusion components
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

interface RecoverPasswordForm {
  usernameOrEmail: FormControl<string>;
}

@Component({
  selector: 'app-recover-password-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    TextBoxModule,
    ButtonModule
  ],
  template: `
    <div class="recover-container">
      <div class="recover-card">
        <div class="card-header">
          <h2>Recover Password</h2>
        </div>
        <div class="card-content">
          <p *ngIf="isSuccess" class="success-message">
            Please check your email to reset your password.
          </p>
          <form *ngIf="!isSuccess" #form="ngForm" [formGroup]="recoverPasswordForm" (ngSubmit)="recover()" novalidate>
            <div class="form-group">
              <label for="usernameOrEmail">Username or Email</label>
              <input type="text" id="usernameOrEmail" class="e-input" formControlName="usernameOrEmail" 
                     autocomplete="email" (keydown.enter)="recover()">
              <div *ngIf="usernameOrEmail.invalid && (usernameOrEmail.dirty || usernameOrEmail.touched)" class="error-message">
                <div *ngIf="usernameOrEmail.errors?.['required']">Username or email is required</div>
              </div>
            </div>
          </form>
        </div>
        <div class="card-actions">
          <button *ngIf="!isSuccess" ejs-button cssClass="e-primary" [disabled]="isLoading" (click)="recover()">
            <div *ngIf="isLoading" class="spinner-container">
              <span class="loading-icon">⌛</span>
            </div>
            <span>RECOVER</span>
          </button>
          <a *ngIf="!isSuccess" ejs-button cssClass="e-flat" routerLink="/">CANCEL</a>
          <a *ngIf="isSuccess" ejs-button cssClass="e-success" routerLink="/">FINISH</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recover-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .recover-card {
      width: 100%;
      max-width: 400px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .card-header {
      background-color: var(--app-primary-color, #3f51b5);
      color: white;
      padding: 20px;
    }
    
    .card-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .card-content {
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .e-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .e-input:focus {
      border-color: var(--app-primary-color, #3f51b5);
      outline: none;
    }
    
    .success-message {
      color: #4caf50;
      font-weight: 500;
      text-align: center;
      padding: 10px;
      background-color: rgba(76, 175, 80, 0.1);
      border-radius: 4px;
    }
    
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .card-actions {
      padding: 10px 20px 20px;
      display: flex;
      justify-content: space-between;
    }
    
    .spinner-container {
      display: inline-flex;
      margin-right: 8px;
    }
    
    .loading-icon {
      display: inline-block;
      animation: spin 2s infinite linear;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class RecoverPasswordStandaloneComponent implements OnInit {
  isLoading = false;
  isSuccess = false;

  recoverPasswordForm: FormGroup<RecoverPasswordForm>;

  @ViewChild('form')
  private form: NgForm;

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private formBuilder: FormBuilder) {
    this.buildForm();
    console.log('RecoverPasswordStandaloneComponent initialized');
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
      .subscribe({ 
        next: _ => this.saveSuccessHelper(), 
        error: error => this.saveFailedHelper(error) 
      });
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