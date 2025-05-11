import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minimal-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome to Coordinate App</h1>
        <p>Angular 19 Migration with Standalone Components</p>
      </div>

      <div class="navigation-section">
        <h2>Navigation</h2>
        <p>Use the navigation bar above to explore the following sections:</p>
        <ul class="navigation-links">
          <li><a [routerLink]="['/']">Home</a> - This dashboard</li>
          <li><a [routerLink]="['/settings']">Settings</a> - User preferences and settings</li>
          <li><a [routerLink]="['/admin/users']">Users</a> - User management</li>
          <li><a [routerLink]="['/admin/roles/editor']">Roles</a> - Role management</li>
          <li><a [routerLink]="['/about']">About</a> - About the application</li>
        </ul>
      </div>

      <div class="info-section">
        <h2>Standalone Components Migration</h2>
        <p>We've migrated these components to standalone:</p>
        <ul>
          <li>AppComponent</li>
          <li>FooterComponent</li>
          <li>SettingsComponent</li>
          <li>UserEditorComponent</li>
          <li>RoleEditorComponent</li>
          <li>UserListComponent</li>
          <li>AboutComponent</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 2rem;
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      color: #3f51b5;
      margin-bottom: 0.5rem;
    }

    .welcome-section p {
      font-size: 1.2rem;
      color: #666;
    }

    .navigation-section {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .navigation-section h2 {
      color: #3f51b5;
      margin-top: 0;
    }

    .navigation-links {
      list-style: none;
      padding: 0;
    }

    .navigation-links li {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .navigation-links li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #3f51b5;
    }

    .navigation-links a {
      color: #3f51b5;
      font-weight: bold;
      text-decoration: none;
    }

    .navigation-links a:hover {
      text-decoration: underline;
    }

    .info-section {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .info-section h2 {
      color: #3f51b5;
      margin-top: 0;
    }

    .info-section ul {
      padding-left: 1.5rem;
      columns: 2;
    }

    .info-section li {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .info-section ul {
        columns: 1;
      }
    }
  `]
})
export class MinimalDashboardComponent {}