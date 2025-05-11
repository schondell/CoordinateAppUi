import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Import providers and routes
import { AppRoutingModule } from './app/app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthScopeInterceptor } from './app/services/auth-scope-interceptor';

// Import needed services
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

// External modules
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastaModule } from 'ngx-toasta';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Import Syncfusion modules
import { registerLicense } from '@syncfusion/ej2-base';
import { PageService, SortService, ToolbarService, PdfExportService, ExcelExportService } from '@syncfusion/ej2-angular-grids';

// Register Syncfusion license
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdnVQR2JYV0R3Wkc=');

// Debug console logs
console.log('Starting standalone application bootstrap with routing');

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

if (environment.production) {
  enableProdMode();
}

// Try/catch to better track bootstrap errors
try {
  console.log('About to bootstrap application');
  
  bootstrapApplication(AppComponent, {
    providers: [
      // Import routing
      importProvidersFrom(AppRoutingModule),
      
      // Basic Angular providers
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
      
      // Base URL
      { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
      
      // Services
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
  .then(ref => {
    console.log('Angular standalone app bootstrapped successfully');
  })
  .catch(err => {
    console.error('Error during bootstrap:', err);
  });
} catch (e) {
  console.error('Fatal error during startup:', e);
}
