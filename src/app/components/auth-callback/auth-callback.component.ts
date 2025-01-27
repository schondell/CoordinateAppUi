


//



import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService, OidcProviders } from '../../services/auth.service';
import { Utilities } from '../../services/utilities';
import { JwtHelper } from '../../services/jwt-helper';


interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}


@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})

export class AuthCallbackComponent implements OnInit, AfterViewInit, OnDestroy {

  message: string;
  isLoading = false;
  provider: OidcProviders;
  externalAuthToken: string;
  email: string;
  pageSubscriptions = new Subscription();

  loginForm: FormGroup<LoginForm>;

  @ViewChildren('form')
  private forms: QueryList<NgForm>;
  private form: NgForm;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
      return;
    } else {
      this.pageSubscriptions.add(
        this.authService.getLoginStatusEvent().subscribe(() => {
          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          }
        }));
    }

    this.setProvider(this.route.snapshot.url[0].path);
    this.isLoading = true;

    if (this.provider === 'twitter') {
      this.route.queryParams.subscribe(params => {
        const queryParams: any = Utilities.GetObjectWithLoweredPropertyNames(params);
        this.processTokens(queryParams);
      });
    }
    else {
      this.pageSubscriptions.add(
        this.authService.processExternalOidcLoginTokens(this.provider).subscribe({
          next: tokens => {
            this.processTokens(tokens);
          },
          error: error => {
            this.isLoading = false;
            this.message = null;
            this.showLoginErrorMessage(JSON.stringify(error));
          }
        }));
    }
  }

  ngAfterViewInit() {
    this.pageSubscriptions.add(
      this.forms.changes.subscribe(ql => this.form = this.forms.first)
    );
  }

  ngOnDestroy() {
    this.pageSubscriptions.unsubscribe();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control({ value: '', disabled: true }),
      password: ['', Validators.required]
    });
  }

  get passwordControl() { return this.loginForm.get('password'); }

  get foundEmail(): string {
    const formModel = this.loginForm.getRawValue();
    return formModel.email;
  }
  set foundEmail(email: string) {
    this.loginForm.patchValue({ email });
  }

  get userPassword(): string {
    const formModel = this.loginForm.value;
    return formModel.password;
  }
  set userPassword(password: string) {
    this.loginForm.patchValue({ password });
  }

  getShouldRedirect() {
    return this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  setProvider(url: string) {
    const google = 'google';
    const facebook = 'facebook';
    const twitter = 'twitter';
    const microsoft = 'microsoft';

    if (url.includes(google)) {
      this.provider = google;
    } else if (url.includes(facebook)) {
      this.provider = facebook;
    } else if (url.includes(twitter)) {
      this.provider = twitter;
    } else if (url.includes(microsoft)) {
      this.provider = microsoft;
    }
    else {
      throw new Error('Unknown login provider');
    }
  }

  processTokens(tokensObject: any) {
    let tokenProcessed = false;

    if (tokensObject) {
      if (tokensObject.access_token) {
        if (tokensObject.id_token) {
          const decodedIdToken = new JwtHelper().decodeToken(tokensObject.id_token);
          this.email = decodedIdToken.email || decodedIdToken.emailAddress;
        } else {
          this.email = null;
        }

        tokenProcessed = true;
        this.loginWithToken(tokensObject.access_token, this.provider, this.email);
      } else if (tokensObject.oauth_token && tokensObject.oauth_verifier) {
        if (this.provider === 'twitter') {
          tokenProcessed = true;
          this.isLoading = true;
          this.message = 'Connecting to twitter...';
          this.authService.getTwitterAccessToken(tokensObject.oauth_token, tokensObject.oauth_verifier)
            .subscribe({
              next: accessToken => {
                this.isLoading = true;
                this.message = 'Processing...';
                this.loginWithToken(accessToken, this.provider);
              },
              error: error => {
                this.isLoading = false;
                this.message = null;
                this.showLoginErrorMessage(error);
              }
            });
        }
      }
    }

    if (!tokenProcessed) {
      setTimeout(() => {
        this.alertService.showMessage('Invalid login', 'No valid tokens found', MessageSeverity.error);
      }, 500);

      this.message = 'Error.';
      this.authService.redirectLogoutUser();
    }
  }

  loginWithToken(token: string, provider: string, email?: string) {
    this.externalAuthToken = token;
    this.isLoading = true;
    this.message = 'Processing...';
    this.alertService.startLoadingMessage('', 'Signing in...');

    this.authService.loginWithExternalToken(token, provider, email)
      .subscribe({
        next: user => {
          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;

            this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
          }, 500);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.isLoading = false;
          this.message = 'Error.';
          this.foundEmail = Utilities.findHttpResponseMessage('email', error);

          if (this.foundEmail) {
            const errorMessage = Utilities.getHttpResponseMessage(error);
            this.alertService.showStickyMessage('User already exists', this.mapLoginErrorMessage(errorMessage), MessageSeverity.default, error);
          } else {
            this.showLoginErrorMessage(error);
          }
        }
      });
  }


  linkAccountAndLogin() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.loginForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    this.authService.loginWithExternalToken(this.externalAuthToken, this.provider, this.email, this.userPassword)
      .subscribe({
        next: user => {
          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.userPassword = '';

            this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
          }, 500);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.showLoginErrorMessage(error, false);

          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      });
  }

  showLoginErrorMessage(error, redirect = true) {
    setTimeout(() => {
      if (Utilities.checkNoNetwork(error)) {
        this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
      } else {
        const errorMessage = Utilities.getHttpResponseMessage(error);
        if (errorMessage) {
          this.alertService.showStickyMessage('Unable to login', this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
        } else {
          this.alertService.showStickyMessage('Unable to login', 'An error occurred, please try again later.\nError: ' + Utilities.getResponseBody(error), MessageSeverity.error, error);
        }
      }

    }, 500);

    if (redirect) {
      this.authService.redirectLogoutUser();
    }
  }

  mapLoginErrorMessage(error: string) {
    if (error === 'invalid_username_or_password') {
      return 'Invalid username or password';
    }

    return error;
  }
}
