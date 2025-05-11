import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Registering Syncfusion license key
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdnVQR2JYV0R3Wkc=');

// Debug console logs
console.log('Starting application bootstrap');

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

// Try/catch to better track bootstrap errors
try {
  console.log('About to bootstrap module');
  
  platformBrowserDynamic(providers).bootstrapModule(AppModule)
    .then(ref => {
      console.log('Angular app bootstrapped successfully');
    })
    .catch(err => {
      console.error('Error during bootstrap:', err);
    });
} catch (e) {
  console.error('Fatal error during startup:', e);
}
