/**
 * Simplified standalone bootstrap file for Angular 19
 * This provides a minimal version focused on the Journal feature
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';

// Import app component
import { AppComponent } from './app/app.component';

// Import required components
import { DrivingJournalStandaloneComponent } from './app/components/driving-journal/driving-journal/driving-journal.component.standalone';
import { NotFoundStandaloneComponent } from './app/components/not-found/not-found.component.standalone';
import { HomeStandaloneComponent } from './app/components/home/home.component.standalone';
import { AboutStandaloneComponent } from './app/components/about/about.component.standalone';

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
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridModule, PageService, SortService, FilterService } from '@syncfusion/ej2-angular-grids';

// Register Syncfusion license
registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5XdEJiX35XcXRdT2VVWkZ/');

// Debug output
console.log('Starting standalone bootstrap for Journal feature');

// Define routes - only include what we need for Journal
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'journal' },
  { path: 'home', component: HomeStandaloneComponent },
  { path: 'about', component: AboutStandaloneComponent },
  
  // Journal routes
  { path: 'journal', component: DrivingJournalStandaloneComponent },
  { path: 'journal/year/:year/month/:month/vehicleid/:vehicleId', component: DrivingJournalStandaloneComponent },
  
  // Fallback route
  { path: '**', component: NotFoundStandaloneComponent }
];

// Production mode check
if (environment.production) {
  enableProdMode();
}

// Bootstrap with minimal required providers
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    
    // Core services
    AlertService,
    AccountService,
    AuthService,
    AuthGuard,
    AppTitleService,
    ConfigurationService,
    LocalStoreManager,
    NotificationService,
    NotificationEndpoint,
    AccountEndpoint,
    
    // Translation
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLanguageLoader
        }
      })
    ),
    AppTranslationService,
    
    // Syncfusion services
    importProvidersFrom(
      ButtonModule,
      DatePickerModule,
      DropDownListModule,
      GridModule
    ),
    PageService,
    SortService,
    FilterService
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});