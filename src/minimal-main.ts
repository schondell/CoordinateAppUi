/**
 * Minimal bootstrap file for Angular 19 standalone app
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StandaloneAppComponent } from './app/app-bootstrap.standalone';
import { SettingsStandaloneComponent } from './app/settings/settings.component.standalone';
import { UserEditorStandaloneComponent } from './app/admin/user-editor/user-editor.component.standalone';
import { RoleEditorStandaloneComponent } from './app/admin/role-editor/role-editor.component.standalone';
import { UserListStandaloneComponent } from './app/admin/user-list/user-list.component.standalone';
import { MinimalDashboardComponent } from './app/minimal-dashboard.component';
import { AboutStandaloneComponent } from './app/components/about/about.component.standalone';
import { environment } from './environments/environment';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Import services
import { AlertService } from './app/services/alert.service';
import { AccountService } from './app/services/account.service';
import { AuthService } from './app/services/auth.service';
import { AuthGuard } from './app/services/auth-guard.service';
import { AppTitleService } from './app/services/app-title.service';
import { ConfigurationService } from './app/services/configuration.service';
import { LocalStoreManager } from './app/services/local-store-manager.service';
import { NotificationService } from './app/services/notification.service';
import { NotificationEndpoint } from './app/services/notification-endpoint.service';
import { AccountEndpoint } from './app/services/account-endpoint.service';

// Translation support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppTranslationService, TranslateLanguageLoader } from './app/services/app-translation.service';

// Import Syncfusion modules
import { registerLicense } from '@syncfusion/ej2-base';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, PageService, SortService, FilterService } from '@syncfusion/ej2-angular-grids';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

// Register Syncfusion license
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdnVQR2JYV0R3Wkc=');

// Import styles are loaded via index.html

console.log('Starting standalone application bootstrap');

// Define routes
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: MinimalDashboardComponent },
  { path: 'settings', component: SettingsStandaloneComponent },
  { path: 'admin/users', component: UserListStandaloneComponent },
  { path: 'admin/users/editor', component: UserEditorStandaloneComponent },
  { path: 'admin/roles/editor', component: RoleEditorStandaloneComponent },
  { path: 'admin/roles', redirectTo: 'admin/roles/editor' },
  { path: 'about', component: AboutStandaloneComponent },
  { path: '**', redirectTo: 'dashboard' }
];

if (environment.production) {
  enableProdMode();
}

// Bootstrap with required dependencies
bootstrapApplication(StandaloneAppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    
    // Only include minimal required providers to avoid errors
    
    // Translation
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLanguageLoader
        }
      })
    ),
    AppTranslationService
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});