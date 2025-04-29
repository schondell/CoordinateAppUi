import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-standalone',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="logout-container">
      <div class="logout-box">
        <div class="logout-icon">🔒</div>
        <h2>Logging Out</h2>
        <p>Please wait while we securely log you out...</p>
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .logout-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.03);
    }
    
    .logout-box {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 30px;
      text-align: center;
      max-width: 400px;
    }
    
    .logout-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    h2 {
      color: var(--app-primary-color, #3f51b5);
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 24px;
    }
    
    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: var(--app-primary-color, #3f51b5);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LogoutStandaloneComponent implements OnInit {
  constructor(private authService: AuthService) {
    console.log('LogoutStandaloneComponent initialized');
  }

  ngOnInit() {
    setTimeout(() => {
      this.authService.logout();
      this.authService.redirectLogoutUser();
    }, 1000);
  }
}