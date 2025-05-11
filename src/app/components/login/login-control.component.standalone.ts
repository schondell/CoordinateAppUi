import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, NgForm, Validators } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { UserLogin } from '../../models/user-login.model';
// Syncfusion components
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

interface LoginForm {
  userName: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-login-control-standalone',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    CheckBoxModule,
    TranslateModule
  ],
  template: `
    <form #form="ngForm" [formGroup]="loginForm" (ngSubmit)="login()" novalidate class="login-form">
      <div class="form-group">
        <label for="userName">Username</label>
        <input type="text" id="userName" class="e-input" formControlName="userName" 
               autocomplete="username" (keydown.enter)="enterKeyDown()">
        <div *ngIf="userName.invalid && (userName.dirty || userName.touched)" class="error-message">
          <div *ngIf="userName.errors?.['required']">User name is required</div>
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" class="e-input" formControlName="password" 
               autocomplete="current-password" (keydown.enter)="enterKeyDown()">
        <div *ngIf="password.invalid && (password.dirty || password.touched)" class="error-message">
          <div *ngIf="password.errors?.['required']">Password is required</div>
        </div>
      </div>

      <div class="form-group checkbox-group">
        <ejs-checkbox formControlName="rememberMe" label="Remember me" (keydown.enter)="enterKeyDown()"></ejs-checkbox>
      </div>
    </form>
  `,
  styles: [`
    .login-form {
      width: 100%;
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
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class LoginControlStandaloneComponent implements OnInit, OnDestroy {
  isLoading = false;
  isGoogleLogin = false;
  isFacebookLogin = false;
  isTwitterLogin = false;
  isMicrosoftLogin = false;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;

  loginForm: FormGroup<LoginForm>;

  @ViewChild('form', { static: true })
  private form: NgForm;
  
  @Input()
  isModal = false;

  @Output()
  enterKeyPress = new EventEmitter();
  
  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private configurations: ConfigurationService,
    private formBuilder: FormBuilder) {
    this.buildForm();
    console.log('LoginControlStandaloneComponent initialized');
  }

  ngOnInit() {
    this.loginForm.setValue({
      userName: '',
      password: '',
      rememberMe: this.authService.rememberMe
    });

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent()
        .subscribe(isLoggedIn => {
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
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: false as boolean
    });
  }

  get userName() { return this.loginForm.get('userName'); }

  get password() { return this.loginForm.get('password'); }

  getShouldRedirect() {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  getUserLogin(): UserLogin {
    const formModel = this.loginForm.value;
    return new UserLogin(formModel.userName, formModel.password, formModel.rememberMe);
  }

  login() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.loginForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.isExternalLogin = false;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    this.authService.loginWithPassword(this.getUserLogin())
      .subscribe({
        next: user => {
          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.loginForm.reset();

            if (!this.isModal) {
              this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
            } else {
              this.alertService.showMessage('Login', `Session for ${user.userName} restored!`, MessageSeverity.success);
              setTimeout(() => {
                this.alertService.showStickyMessage('Session Restored', 'Please try your last operation again', MessageSeverity.default);
              }, 500);

              this.closeModal();
            }
          }, 500);
        },
        error: error => {
          this.alertService.stopLoadingMessage();

          if (Utilities.checkNoNetwork(error)) {
            this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
            this.offerAlternateHost();
          } else {
            const errorMessage = Utilities.getHttpResponseMessage(error);

            if (errorMessage) {
              this.alertService.showStickyMessage('Unable to login', this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
            } else {
              this.alertService.showStickyMessage('Unable to login', 'An error occurred, please try again later.\nError: ' + Utilities.getResponseBody(error), MessageSeverity.error, error);
            }
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      });
  }

  get isExternalLogin() {
    return this.isGoogleLogin || this.isFacebookLogin || this.isTwitterLogin || this.isMicrosoftLogin;
  }

  set isExternalLogin(value: boolean) {
    this.isGoogleLogin = value;
    this.isFacebookLogin = value;
    this.isTwitterLogin = value;
    this.isMicrosoftLogin = value;
  }

  offerAlternateHost() {
    if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {

      const apiUrl = prompt('Dear Developer!\nIt appears your backend Web API service is not running...\n' +
        'Would you want to temporarily switch to the online Demo API below?(Or specify another)', this.configurations.fallbackBaseUrl);

      if (apiUrl) {
        this.configurations.baseUrl = apiUrl;
        this.alertService.showStickyMessage('API Changed!', 'The target Web API has been changed to: ' + apiUrl, MessageSeverity.warn);
      }
    }
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

  enterKeyDown() {
    this.enterKeyPress.emit();
  }
}