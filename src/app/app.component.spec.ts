import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FooterModule } from './shared/footer/footer.component';
import { ThemePickerModule } from './shared/theme-picker/theme-picker.component';

import { AppComponent } from './app.component';
import { LoginControlComponent } from './components/login/login-control.component';
import { NotificationsViewerComponent } from './components/controls/notifications-viewer.component';

import { OAuthModule } from 'angular-oauth2-oidc';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastaModule } from 'ngx-toasta';

import { AuthService } from './services/auth.service';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        FooterModule,
        ThemePickerModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLanguageLoader
          }
        }),
        OAuthModule.forRoot(),
        ToastaModule.forRoot(),
        DialogModule
      ],
      declarations: [
        AppComponent,
        LoginControlComponent,
        NotificationsViewerComponent
      ],
      providers: [
        AuthService,
        AlertService,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        OidcHelperService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'QuickApp Pro'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    expect(app.appTitle).toEqual('QuickApp Pro');
  });

  it(`should render 'QuickApp' in a p tag`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('QuickApp');
  });
});
