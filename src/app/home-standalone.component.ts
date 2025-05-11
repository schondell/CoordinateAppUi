import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="content">
      <h2>Standalone Components Migration</h2>
      <p>We've migrated these components to standalone:</p>
      <ul>
        <li>AppComponent</li>
        <li>FooterComponent</li>
        <li>AppDialogComponent</li>
        <li>UserPreferencesComponent</li>
        <li>SettingsComponent</li>
        <li>UserEditorComponent</li>
        <li>RoleEditorComponent</li>
        <li>UserListComponent</li>
      </ul>
      
      <div class="info-box">
        <h3>Migration Status</h3>
        <p>Partial migration to Angular 19 completed successfully</p>
        <p>Working on converting remaining components...</p>
      </div>
      
      <div class="navigation-box">
        <h3>Navigation</h3>
        <p>You can navigate to the following pages to see the migrated components in action:</p>
        <ul>
          <li><a routerLink="/settings">Settings</a> - User preferences with Syncfusion components</li>
          <li><a routerLink="/admin/users">User List</a> - Admin user management with Syncfusion Grid</li>
          <li><a routerLink="/admin/users/editor">User Editor</a> - Admin user editing with Syncfusion forms</li>
          <li><a routerLink="/admin/roles/editor">Role Editor</a> - Admin role management with Syncfusion UI</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
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
  `]
})
export class HomeStandaloneComponent {}