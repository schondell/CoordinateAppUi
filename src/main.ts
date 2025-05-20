import { enableProdMode, importProvidersFrom, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { provideRouter, withComponentInputBinding, withRouterConfig, RouteReuseStrategy, UrlSerializer } from '@angular/router';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { DatePipe, DecimalPipe } from '@angular/common';

// Routes
import { routes } from './app/app.routes';
import { LowerCaseUrlSerializer } from './app/services/url-serializer';

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
import { AppErrorHandler } from './app/app-error.handler';

// External modules
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastaModule, ToastaService, ToastaConfig } from 'ngx-toasta';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Syncfusion
import { registerLicense } from '@syncfusion/ej2-base';
import { SyncfusionProviders } from './app/shared/syncfusion-standalone';

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
      // Core Angular providers
      provideClientHydration(),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
      { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
      
      // Router configuration
      provideRouter(
        routes,
        withComponentInputBinding(),
        withRouterConfig({ 
          paramsInheritanceStrategy: 'always',
          urlUpdateStrategy: 'eager' 
        })
      ),
      { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
      
      // Error handling
      { provide: ErrorHandler, useClass: AppErrorHandler },
      
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
      ToastaService,
      ToastaConfig,
      
      // Auth providers
      { provide: OAuthStorage, useClass: OidcTempStorage },
      { provide: HTTP_INTERCEPTORS, useClass: AuthScopeInterceptor, multi: true },
      
      // Common utilities
      DatePipe,
      DecimalPipe,
      
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
      ...SyncfusionProviders
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