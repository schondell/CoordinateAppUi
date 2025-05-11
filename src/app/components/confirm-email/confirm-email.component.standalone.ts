import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

// Services
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Utilities } from '../../services/utilities';

// Syncfusion components
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-confirm-email-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule
  ],
  template: `
    <div class="confirm-email-container">
      <div class="confirm-email-card">
        <div class="card-header">
          <h2>Confirm Email</h2>
        </div>
        <div class="card-content">
          <div *ngIf="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <p>Confirming your email...</p>
          </div>
          <div *ngIf="!isLoading" [class.success]="isSuccess" [class.error]="!isSuccess">
            <div class="status-icon">
              <span *ngIf="isSuccess">✓</span>
              <span *ngIf="!isSuccess">✗</span>
            </div>
            <p>{{message}}</p>
          </div>
        </div>
        <div class="card-actions">
          <a ejs-button [cssClass]="isSuccess ? 'e-success' : 'e-danger'" routerLink="/login">
            Finish
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-email-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .confirm-email-card {
      width: 100%;
      max-width: 500px;
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
      padding: 40px 20px;
      text-align: center;
    }
    
    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: var(--app-primary-color, #3f51b5);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    
    .status-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .success .status-icon {
      color: #4caf50;
    }
    
    .error .status-icon {
      color: #f44336;
    }
    
    .success p {
      color: #2e7d32;
    }
    
    .error p {
      color: #d32f2f;
    }
    
    .card-actions {
      padding: 10px 20px 20px;
      display: flex;
      justify-content: center;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ConfirmEmailStandaloneComponent implements OnInit {
  isLoading = false;
  isSuccess: boolean;
  message: string;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService) {
    console.log('ConfirmEmailStandaloneComponent initialized');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const loweredParams: any = Utilities.GetObjectWithLoweredPropertyNames(params);
      const userId = loweredParams.userid;
      const code = loweredParams.code;

      if (!userId || !code) {
        this.authService.gotoHomePage();
      } else {
        this.confirmEmail(userId, code);
      }
    });
  }

  confirmEmail(userId: string, code: string) {
    this.isLoading = true;
    this.message = 'Confirming account email...';
    this.alertService.startLoadingMessage('', 'Confirming account email...');

    this.accountService.confirmUserAccount(userId, code)
      .subscribe({ 
        next: _ => this.saveSuccessHelper(), 
        error: error => this.saveFailedHelper(error, userId, code) 
      });
  }

  private saveSuccessHelper() {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = true;

    this.message = 'Thank you for confirming your email.';

    setTimeout(() => {
      this.alertService.showMessage('Email Confirmed', 'Your email address was successfully confirmed', MessageSeverity.success);
    }, 2000);
  }

  private saveFailedHelper(error: any, userId: string, code: string) {
    this.alertService.stopLoadingMessage();
    this.isLoading = false;
    this.isSuccess = false;

    this.message = `We were unable to confirm the email for user with ID "${userId}"`;

    setTimeout(() => {
      const errorData = Utilities.getResponseBody(error);

      if (Utilities.checkNotFound(error) && errorData === userId) {
        this.alertService.showStickyMessage('Email Not Confirmed', `No user with id "${userId}" was found`, MessageSeverity.error, error);
      } else {
        const errorMessage = Utilities.getHttpResponseMessage(error);

        if (errorMessage) {
          this.alertService.showStickyMessage('Email Not Confirmed', errorMessage, MessageSeverity.error, error);
        } else {
          this.alertService.showStickyMessage('Email Not Confirmed', `An error occurred whilst confirming your email.\nError: ${errorData}`, MessageSeverity.error, error);
        }
      }
    }, 2000);
  }
}