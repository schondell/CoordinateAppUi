/**
 * Extremely simplified main.ts for Angular 19
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MinimalAppComponent } from './app/minimal-app.component';
import { MinimalDashboardComponent } from './app/minimal-dashboard.component';

// Extremely simple home component
class HomeComponent {
  static ngComponentDef = {
    type: HomeComponent,
    selectors: [['app-home']],
    factory: () => new HomeComponent(),
    template: (rf, ctx) => {
      if (rf) {
        // Create elements
      }
      // Bind elements
    }
  };
}

// Simple routes
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MinimalDashboardComponent },
  { path: 'journal', loadComponent: () => import('./app/components/driving-journal/driving-journal-simple.component').then(m => m.DrivingJournalSimpleComponent) }
];

console.log('Starting minimal bootstrap');

// Minimal bootstrap with only essential providers
bootstrapApplication(MinimalAppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => {
  console.error('Error during bootstrap:', err);
  console.error('Error stack:', err.stack);
});