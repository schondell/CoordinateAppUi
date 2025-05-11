import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, NgForm, Validators } from '@angular/forms';

// Services
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';

// Validators
import { EqualValidator } from '../../shared/validators/equal.validator';

// Syncfusion components
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

interface ResetPasswordForm {
  usernameOrEmail: FormControl<string>;
  password: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
}

@Component({
  selector: 'app-reset-password-standalone',
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
    <div class="reset-container">
      <div class="reset-card">
        <div class="card-header">
          <h2>Reset Password</h2>
        </div>
        <div class="card-content">
          <p *ngIf="isSuccess" class="success-message">
            Your password has been reset. Please <a routerLink="/login">click here to login</a>.
          </p>
          <form *ngIf="!isSuccess" #form="ngForm" [formGroup]="resetPasswordForm" (ngSubmit)="resetPassword()" novalidate>
            <div class="form-group">
              <label for="usernameOrEmail">Username or Email</label>
              <input type="text" id="usernameOrEmail" class="e-input" formControlName="usernameOrEmail" 
                     autocomplete="email" (keydown.enter)="resetPassword()">
              <div *ngIf="usernameOrEmail.invalid && (usernameOrEmail.dirty || usernameOrEmail.touched)" class="error-message">
                <div *ngIf="usernameOrEmail.errors?.['required']">Username or email is required</div>
              </div>
            </div>
            
            <div formGroupName="password">
              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" class="e-input" formControlName="newPassword" 
                       autocomplete="new-password" (keydown.enter)="resetPassword()">
                <div *ngIf="newPassword.invalid && (newPassword.dirty || newPassword.touched)" class="error-message">
                  <div *ngIf="newPassword.errors?.['required']">Password is required</div>
                  <div *ngIf="!newPassword.errors?.['required'] && newPassword.errors?.['pattern']">
                    Password must contain at least: one uppercase letter, one lowercase letter, one digit, and any special character
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" class="e-input" formControlName="confirmPassword" 
                       autocomplete="new-password" (keydown.enter)="resetPassword()">
                <div *ngIf="confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched)" class="error-message">
                  <div *ngIf="confirmPassword.errors?.['required']">Confirm password is required</div>
                  <div *ngIf="!confirmPassword.errors?.['required'] && confirmPassword.errors?.['notEqual']">
                    Passwords do not match
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="card-actions">
          <button *ngIf="!isSuccess" ejs-button cssClass="e-primary" [disabled]="isLoading" (click)="resetPassword()">
            <div *ngIf="isLoading" class="spinner-container">
              <span class="loading-icon">⌛</span>
            </div>
            <span>SUBMIT</span>
          </button>
          <a *ngIf="!isSuccess" ejs-button cssClass="e-flat" routerLink="/">CANCEL</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .reset-card {
      width: 100%;
      max-width: 450px;
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
    
    .success-message a {
      color: var(--app-primary-color, #3f51b5);
      text-decoration: none;
      font-weight: 600;
    }
    
    .success-message a:hover {
      text-decoration: underline;
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
export class ResetPasswordStandaloneComponent implements OnInit {
  isLoading = false;
  isSuccess = false;
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
    console.log('ResetPasswordStandaloneComponent initialized');
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
      .subscribe({ 
        next: _ => this.saveSuccessHelper(), 
        error: error => this.saveFailedHelper(error) 
      });
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