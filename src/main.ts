import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Routing and modules
import { AppRoutingModule } from './app/app-routing.module';

// Services
import { ThemeManager } from './app/shared/theme-picker/theme-manager';
import { ConfigurationService } from './app/services/configuration.service';
import { AppTitleService } from './app/services/app-title.service';
import { AlertService } from './app/services/alert.service';
import { AuthService } from './app/services/auth.service';
import { AuthGuard } from './app/services/auth-guard.service';
import { LocalStoreManager } from './app/services/local-store-manager.service';
import { NotificationService } from './app/services/notification.service';
import { NotificationEndpoint } from './app/services/notification-endpoint.service';
import { AccountService } from './app/services/account.service';
import { AccountEndpoint } from './app/services/account-endpoint.service';
import { OidcHelperService, OidcTempStorage } from './app/services/oidc-helper.service';
import { AppTranslationService, TranslateLanguageLoader } from './app/services/app-translation.service';
import { AuthScopeInterceptor } from './app/services/auth-scope-interceptor';

// External modules
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastaModule } from 'ngx-toasta';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Syncfusion
import { registerLicense } from '@syncfusion/ej2-base';
import { PageService, SortService, ToolbarService, PdfExportService, ExcelExportService } from '@syncfusion/ej2-angular-grids';

// Register Syncfusion license
registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdkFjUH1adHRSRGZfWkZ/');

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

if (environment.production) {
  enableProdMode();
}

try {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(AppRoutingModule),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
      { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },

      // App services
      AlertService,
      ConfigurationService,
      AppTitleService,
      AppTranslationService,
      NotificationService,
      NotificationEndpoint,
      AccountService,
      AccountEndpoint,
      LocalStoreManager,
      AuthService,
      AuthGuard,
      ThemeManager,
      OidcHelperService,
      { provide: OAuthStorage, useClass: OidcTempStorage },
      { provide: HTTP_INTERCEPTORS, useClass: AuthScopeInterceptor, multi: true },

      // Third-party modules
      importProvidersFrom(
          OAuthModule.forRoot(),
          ToastaModule.forRoot(),
          GoogleMapsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLanguageLoader
            }
          })
      ),

      // Syncfusion services
      PageService,
      SortService,
      ToolbarService,
      PdfExportService,
      ExcelExportService
    ]
  })
      .then(() => {
        console.log('Angular standalone app bootstrapped successfully');
      })
      .catch(err => {
        console.error('Error during bootstrap:', err);
      });
} catch (e) {
  console.error('Fatal error during startup:', e);
}