/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideRouter, Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';

// Import specific service providers needed for the app
import { AlertService } from './app/services/alert.service';
import { LocalStoreManager } from './app/services/local-store-manager.service';
import { AppTranslationService } from './app/services/app-translation.service';
import { ConfigurationService } from './app/services/configuration.service';
import { AppTitleService } from './app/services/app-title.service';
import { AuthService } from './app/services/auth.service';
import { NotificationService } from './app/services/notification.service';
import { AccountService } from './app/services/account.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SignalrService } from './app/signalr.service';
import { ToastaModule } from 'ngx-toasta';

console.log('Starting application bootstrap with standalone components');

// Define simple routes for minimal version
const routes: Routes = [
  { path: '', component: AppComponent },
  { path: '**', redirectTo: '' }
];

if (environment.production) {
  enableProdMode();
}

// Bootstrap the application with our converted standalone components
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    // Core services
    AlertService,
    LocalStoreManager,
    AppTranslationService,
    ConfigurationService,
    AppTitleService,
    AuthService,
    NotificationService,
    AccountService,
    SignalrService,
    // Common providers
    DatePipe,
    DecimalPipe,
    // Import modules
    importProvidersFrom(
      CommonModule,
      RouterModule,
      TranslateModule.forRoot(),
      ToastaModule.forRoot()
    )
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});