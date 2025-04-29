import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="admin-nav">
      <nav>
        <a routerLink="/admin/users" routerLinkActive="active">
          <span class="icon">👤</span>
          User Management
        </a>
        <a routerLink="/admin/roles" routerLinkActive="active">
          <span class="icon">🔑</span>
          Role Management
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .admin-nav {
      margin-bottom: 20px;
    }
    
    nav {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      background-color: #f5f5f5;
      padding: 10px 15px;
      border-radius: 8px;
    }
    
    a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 15px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.7);
      font-weight: 500;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    a:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    a.active {
      background-color: var(--app-primary-color, #3f51b5);
      color: white;
    }
    
    .icon {
      font-size: 16px;
    }
  `]
})
export class AdminNavStandaloneComponent {
  constructor() {
    console.log('AdminNavStandaloneComponent initialized');
  }
}