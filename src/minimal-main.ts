/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MinimalAppComponent } from './app/minimal-app.component';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';

console.log('Starting minimal application bootstrap');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(MinimalAppComponent, {
  providers: [
    provideAnimations(),
    provideRouter([])
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});