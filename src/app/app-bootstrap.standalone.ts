/**
 * Standalone bootstrap module for Angular 19
 * This file is designed to bootstrap only our converted standalone components,
 * avoiding the need to load components that are still using NgModule-based architecture.
 */
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { SettingsStandaloneComponent } from './settings/settings.component.standalone';

/**
 * A simple shell component that uses only our converted standalone components
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Coordinate App</h1>
        <p>Angular 19 Migration</p>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/settings" routerLinkActive="active">Settings</a>
        </nav>
      </header>
      
      <main>
        <div class="content">
          <h2>Standalone Components Migration</h2>
          <p>We've migrated these components to standalone:</p>
          <ul>
            <li>AppComponent</li>
            <li>FooterComponent</li>
            <li>AppDialogComponent</li>
            <li>UserPreferencesComponent</li>
            <li>SettingsComponent</li>
          </ul>
          
          <div class="info-box">
            <h3>Migration Status</h3>
            <p>Partial migration to Angular 19 completed successfully</p>
            <p>Working on converting remaining components...</p>
          </div>
          
          <div class="navigation-box">
            <h3>Navigation</h3>
            <p>You can navigate to the <a routerLink="/settings">Settings</a> page to see the migrated components in action.</p>
          </div>
        </div>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    header {
      background-color: #3f51b5;
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    header h1 {
      margin: 0;
      font-size: 24px;
    }
    
    header p {
      margin: 5px 0 0;
      opacity: 0.8;
    }
    
    nav {
      margin-top: 15px;
      display: flex;
      justify-content: center;
      gap: 15px;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      padding: 5px 15px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    nav a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: bold;
    }
    
    main {
      flex: 1;
      padding: 20px;
    }
    
    .content {
      max-width: 800px;
      margin: 0 auto;
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .info-box {
      margin-top: 20px;
      padding: 15px;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
    }
    
    .navigation-box {
      margin-top: 20px;
      padding: 15px;
      background-color: #f1f8e9;
      border-left: 4px solid #8bc34a;
      border-radius: 4px;
    }
    
    .navigation-box a {
      color: #3f51b5;
      font-weight: 500;
      text-decoration: none;
    }
    
    .navigation-box a:hover {
      text-decoration: underline;
    }
    
    h2 {
      color: #3f51b5;
      margin-top: 0;
    }
    
    ul {
      padding-left: 20px;
    }
    
    li {
      margin-bottom: 8px;
    }
  `],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, FooterComponent]
})
export class StandaloneAppComponent {}