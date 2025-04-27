/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';

console.log('Starting minimal application bootstrap');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter([])
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});