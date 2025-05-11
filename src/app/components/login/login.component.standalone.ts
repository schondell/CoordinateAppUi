import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginControlStandaloneComponent } from './login-control.component.standalone';
// Syncfusion components
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-login-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LoginControlStandaloneComponent,
    ButtonModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h2>{{ 'mainMenu.Login' | translate }}</h2>
        </div>
        <div class="card-content">
          <app-login-control-standalone 
            [isModal]="false" 
            (enterKeyPress)="loginControl.login()">
          </app-login-control-standalone>
        </div>
        <div class="card-actions">
          <div class="actions-row">
            <button ejs-button cssClass="e-primary" [disabled]="loginControl.isLoading" (click)="loginControl.login()">
              <div *ngIf="loginControl.isLoading && !loginControl.isExternalLogin" class="spinner-container">
                <span class="loading-icon">⌛</span>
              </div>
              <span>{{ 'mainMenu.Login' | translate | uppercase }}</span>
            </button>
            <div class="spacer"></div>
            <a ejs-button cssClass="e-flat" routerLink="/recoverpassword">FORGOT PASSWORD</a>
            <div class="divider"></div>
            <a ejs-button cssClass="e-flat" routerLink="/register">REGISTER</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .card-header {
      background-color: var(--app-primary-color, #3f51b5);
      color: white;
      padding: 20px;
    }
    
    .card-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .card-content {
      padding: 20px;
      margin-bottom: 10px;
    }
    
    .card-actions {
      padding: 0 20px 20px;
    }
    
    .actions-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .spacer {
      flex: 1;
    }
    
    .divider {
      width: 1px;
      height: 24px;
      background-color: #ddd;
      margin: 0 8px;
    }
    
    .spinner-container {
      display: inline-flex;
      margin-right: 8px;
    }
    
    .loading-icon {
      display: inline-block;
      animation: spin 2s infinite linear;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 480px) {
      .actions-row {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      
      .spacer, .divider {
        display: none;
      }
    }
  `]
})
export class LoginStandaloneComponent {
  @ViewChild(LoginControlStandaloneComponent, { static: true })
  loginControl: LoginControlStandaloneComponent;
  
  constructor() {
    console.log('LoginStandaloneComponent initialized');
  }
}