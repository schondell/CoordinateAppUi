import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavStandaloneComponent } from './admin-nav/admin-nav.component.standalone';

@Component({
  selector: 'app-admin-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminNavStandaloneComponent
  ],
  template: `
    <div class="admin-container">
      <h1 class="admin-title">Administration Panel</h1>
      <app-admin-nav-standalone></app-admin-nav-standalone>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .admin-title {
      color: var(--app-primary-color, #3f51b5);
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 500;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
    }
    
    .admin-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
  `]
})
export class AdminStandaloneComponent {
  constructor() {
    console.log('AdminStandaloneComponent initialized');
  }
}