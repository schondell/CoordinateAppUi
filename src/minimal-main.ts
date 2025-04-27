/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StandaloneAppComponent } from './app/app-bootstrap.standalone';
import { environment } from './environments/environment';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

console.log('Starting minimal standalone application bootstrap');

// Define simple routes
const routes: Routes = [
  { path: '', component: StandaloneAppComponent },
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
    provideRouter(routes)
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});