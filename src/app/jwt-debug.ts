// Debug helper to be added to main.ts
import { JwtHelper } from './services/jwt-helper';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Add this to troubleshoot bootstrap issues
console.log('Starting application bootstrap');

try {
  // Add version info
  console.log('Angular app version: 17.3.1');
  console.log('Environment:', environment.production ? 'Production' : 'Development');
  
  // Test JWT helper to see if there are issues
  const jwtHelper = new JwtHelper();
  console.log('JWT Helper initialized');
  
  // Continue with normal bootstrap
  if (environment.production) {
    enableProdMode();
  }
  
  console.log('About to bootstrap module');
  
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(ref => {
      console.log('Angular app bootstrapped successfully');
    })
    .catch(err => {
      console.error('Error during bootstrap:', err);
    });
} catch (e) {
  console.error('Fatal error during startup:', e);
}