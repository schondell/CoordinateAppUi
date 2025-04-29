import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, NgForm, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Services
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';

// Models
import { UserEdit } from '../../models/user-edit.model';

// Validators
import { EqualValidator } from '../../shared/validators/equal.validator';

// Syncfusion components
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

interface RegisterForm {
  userName: FormControl<string>;
  email: FormControl<string>;
  password: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
}

@Component({
  selector: 'app-register-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TextBoxModule,
    ButtonModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <h2>Register</h2>
        </div>
        <div class="card-content">
          <form #form="ngForm" [formGroup]="registerForm" (ngSubmit)="register()" novalidate>
            <div class="form-group">
              <label for="userName">Username</label>
              <input type="text" id="userName" class="e-input" formControlName="userName" 
                     autocomplete="off" (keydown.enter)="register()">
              <div *ngIf="userName.invalid && (userName.dirty || userName.touched)" class="error-message">
                <div *ngIf="userName.errors?.['required']">Username is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="e-input" formControlName="email" 
                     autocomplete="email" (keydown.enter)="register()">
              <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
                <div *ngIf="email.errors?.['required']">Email is required</div>
                <div *ngIf="!email.errors?.['required'] && email.errors?.['email']">Email is invalid</div>
              </div>
            </div>
            
            <div formGroupName="password">
              <div class="form-group">
                <label for="newPassword">Password</label>
                <input type="password" id="newPassword" class="e-input" formControlName="newPassword" 
                       autocomplete="new-password" (keydown.enter)="register()">
                <div *ngIf="newPassword.invalid && (newPassword.dirty || newPassword.touched)" class="error-message">
                  <div *ngIf="newPassword.errors?.['required']">Password is required</div>
                  <div *ngIf="!newPassword.errors?.['required'] && newPassword.errors?.['pattern']">
                    Password must contain: one uppercase letter, one lowercase letter, one digit, and any special character
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" class="e-input" formControlName="confirmPassword" 
                       autocomplete="new-password" (keydown.enter)="register()">
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
          <button ejs-button cssClass="e-primary" [disabled]="isLoading" (click)="register()">
            <div *ngIf="isLoading" class="spinner-container">
              <span class="loading-icon">⌛</span>
            </div>
            <span>REGISTER</span>
          </button>
          <a ejs-button cssClass="e-flat" routerLink="/login">CANCEL</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .register-card {
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
export class RegisterStandaloneComponent implements OnInit, OnDestroy {
  isLoading = false;
  loginStatusSubscription: any;

  registerForm: FormGroup<RegisterForm>;

  @ViewChild('form', { static: true })
  private form: NgForm;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private accountService: AccountService,
    private configurations: ConfigurationService,
    private formBuilder: FormBuilder) {
    this.buildForm();
    console.log('RegisterStandaloneComponent initialized');
  }

  ngOnInit() {
    this.registerForm.setValue({
      userName: '',
      email: '',
      password: {
        newPassword: '',
        confirmPassword: ''
      }
    });

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent()
        .subscribe(() => {
          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.formBuilder.group({
        newPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
      })
    });
  }

  get userName() { return this.registerForm.get('userName'); }
  get email() { return this.registerForm.get('email'); }
  get newPassword() { return this.registerForm.get('password').get('newPassword'); }
  get confirmPassword() { return this.registerForm.get('password').get('confirmPassword'); }

  getShouldRedirect() {
    return this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  getNewUser(): UserEdit {
    const formModel = this.registerForm.value;
    const newUser = new UserEdit();

    newUser.userName = formModel.userName;
    newUser.email = formModel.email;
    newUser.newPassword = formModel.password.newPassword;

    return newUser;
  }

  register() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.registerForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Registering new user...');

    this.accountService.newUser(this.getNewUser(), true)
      .subscribe({ 
        next: _ => this.saveSuccessHelper(), 
        error: error => this.saveFailedHelper(error) 
      });
  }

  private saveSuccessHelper() {
    const user = this.getNewUser();
    this.alertService.stopLoadingMessage();
    this.alertService.showMessage('Success', `User account "${user.userName}" was created successfully`, MessageSeverity.success);

    this.login(user.userName, user.newPassword);
  }

  private saveFailedHelper(error: any) {
    this.isLoading = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'The below errors occurred during registration:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  login(username: string, password: string) {
    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    this.authService.loginWithPassword({ userName: username, password, rememberMe: false })
      .subscribe({
        next: user => {
          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.registerForm.reset();

            this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
            this.alertService.showStickyMessage('', 'Your account was created successfully', MessageSeverity.success);
          }, 500);
        },
        error: error => {
          this.alertService.stopLoadingMessage();

          if (Utilities.checkNoNetwork(error)) {
            this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
          } else {
            const errorMessage = Utilities.getHttpResponseMessage(error);

            if (errorMessage) {
              this.alertService.showStickyMessage('Unable to login', this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
            } else {
              this.alertService.showStickyMessage('Unable to login', 'An error occurred whilst logging in, please try again later.\nError: ' + Utilities.getResponseBody(error), MessageSeverity.error, error);
            }
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      });
  }

  mapLoginErrorMessage(error: string) {
    if (error === 'invalid_username_or_password') {
      return 'Invalid username or password';
    }

    if (error === 'invalid_grant') {
      return 'This account has been disabled';
    }

    return error;
  }
}