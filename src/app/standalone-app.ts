/**
 * Standalone bootstrap for Angular 19
 * This is a complete standalone version without NgModule dependencies
 */
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { DrivingJournalStandaloneComponent } from './components/driving-journal/driving-journal/driving-journal.component.standalone';
import { AuthGuard } from './services/auth-guard.service';

// Configure routes
const routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'journal', component: DrivingJournalStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Journal' } },
  { path: 'journal/year/:year/month/:month/vehicleid/:vehicleId', component: DrivingJournalStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Journal' } }
];

// Enable production mode conditionally
if (environment.production) {
  enableProdMode();
}

// Bootstrap the application
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    AuthGuard
  ]
}).catch(err => console.error(err));