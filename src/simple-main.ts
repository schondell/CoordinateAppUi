/**
 * Simple bootstrap file for debugging Angular startup issues
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

console.log('Starting basic bootstrap without extras');

if (environment.production) {
  enableProdMode();
}

// Simple bootstrap without providers
platformBrowserDynamic().bootstrapModule(AppModule, {
  // Preserve whitespaces to prevent layout issues
  preserveWhitespaces: true
})
.then(success => {
  console.log('Application bootstrapped successfully');
})
.catch(err => {
  console.error('Bootstrap error:', err);
  
  // Try to provide more details about the error
  if (err.message && err.message.includes('BrowserModule')) {
    console.error('Missing BrowserModule. Make sure it is imported in AppModule.');
  } else if (err.message && err.message.includes('zone')) {
    console.error('Zone.js issue. Check if polyfills are loading correctly.');
  }
  
  console.error('Error stack:', err.stack);
});