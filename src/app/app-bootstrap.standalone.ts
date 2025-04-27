/**
 * Standalone bootstrap module for Angular 19
 * This version completely replaces the traditional app with a standalone-only version.
 */
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { SettingsStandaloneComponent } from './settings/settings.component.standalone';
import { UserEditorStandaloneComponent } from './admin/user-editor/user-editor.component.standalone';
import { RoleEditorStandaloneComponent } from './admin/role-editor/role-editor.component.standalone';
import { UserListStandaloneComponent } from './admin/user-list/user-list.component.standalone';

/**
 * This component is the new root component for our standalone-only application
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Coordinate App</h1>
        <p>Angular 19 Migration - Standalone Only</p>
        <nav>
          <a [class.active]="isActive('/')" (click)="navigate('/')">Home</a>
          <a [class.active]="isActive('/settings')" (click)="navigate('/settings')">Settings</a>
          <a [class.active]="isActive('/admin/users')" (click)="navigate('/admin/users')">Users</a>
          <a [class.active]="isActive('/admin/roles/editor')" (click)="navigate('/admin/roles/editor')">Roles</a>
          <a [class.active]="isActive('/about')" (click)="navigate('/about')">About</a>
        </nav>
      </header>
      
      <main>
        <router-outlet></router-outlet>
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
      cursor: pointer;
      display: inline-block;
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
  imports: [
    CommonModule, 
    RouterModule, 
    FooterComponent
  ]
})
export class StandaloneAppComponent {
  constructor(private router: Router) {}
  
  navigate(path: string): void {
    console.log('Navigating to:', path);
    this.router.navigateByUrl(path).then(
      success => console.log('Navigation success:', success),
      error => console.error('Navigation error:', error)
    );
  }
  
  isActive(path: string): boolean {
    return this.router.url === path || 
           (path !== '/' && this.router.url.startsWith(path));
  }
}