/**
 * Standalone bootstrap module for Angular 19
 * This file is designed to bootstrap only our converted standalone components,
 * avoiding the need to load components that are still using NgModule-based architecture.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';

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
      </header>
      
      <main>
        <div class="content">
          <h2>Standalone Components Migration</h2>
          <p>We've migrated these components to standalone:</p>
          <ul>
            <li>AppComponent</li>
            <li>FooterComponent</li>
            <li>AppDialogComponent</li>
          </ul>
          
          <div class="info-box">
            <h3>Migration Status</h3>
            <p>Partial migration to Angular 19 completed successfully</p>
            <p>Working on converting remaining components...</p>
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
  imports: [CommonModule, RouterModule, FooterComponent]
})
export class StandaloneAppComponent {}