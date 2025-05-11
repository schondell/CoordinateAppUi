import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderStandaloneComponent } from '../../shared/page-header/page-header.component.standalone';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-not-found-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PageHeaderStandaloneComponent,
    ButtonModule
  ],
  template: `
    <app-page-header-standalone title="Page Not Found" icon="error"></app-page-header-standalone>
    
    <div [@fadeInOut] class="not-found-container">
      <div class="not-found-icon">
        <span class="icon">🗺️</span>
        <h1>404</h1>
      </div>
      <p>The page you are looking for does not exist or has been moved.</p>
      <button ejs-button cssClass="e-primary" routerLink="/">
        <span>Back to Home</span>
      </button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    .not-found-icon {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .icon {
      font-size: 48px;
      margin-right: 16px;
    }
    
    h1 {
      font-size: 48px;
      font-weight: 700;
      color: var(--app-primary-color, #3f51b5);
      margin: 0;
    }
    
    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 30px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  animations: [fadeInOut]
})
export class NotFoundStandaloneComponent {
  constructor() {
    console.log('NotFoundStandaloneComponent initialized');
  }
}