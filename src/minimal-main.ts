/**
 * Minimal bootstrap file for debugging Angular startup issues
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MinimalAppComponent } from './app/minimal-app.component';
import { environment } from './environments/environment';
import { provideRouter, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

console.log('Starting minimal application bootstrap');

// Define simple routes
const routes: Routes = [
  { path: '', component: MinimalAppComponent },
  { path: '**', redirectTo: '' }
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(MinimalAppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(CommonModule),
    provideRouter(routes)
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
});