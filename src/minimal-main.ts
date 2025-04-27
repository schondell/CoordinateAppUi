/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StandaloneAppComponent } from './app/app-bootstrap.standalone';
import { SettingsStandaloneComponent } from './app/settings/settings.component.standalone';
import { environment } from './environments/environment';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Translation support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppTranslationService, TranslateLanguageLoader } from './app/services/app-translation.service';

console.log('Starting minimal standalone application bootstrap');

// Define simple routes
const routes: Routes = [
  { path: '', component: StandaloneAppComponent },
  { path: 'settings', component: SettingsStandaloneComponent },
  { path: '**', redirectTo: '' }
];

if (environment.production) {
  enableProdMode();
}

// Bootstrap with minimal dependencies
bootstrapApplication(StandaloneAppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
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