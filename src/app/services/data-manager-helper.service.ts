import { Injectable } from '@angular/core';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';

/**
 * Simple helper service for creating and updating DataManager instances
 * with current JWT tokens
 */
@Injectable({
  providedIn: 'root'
})
export class DataManagerHelperService {
  
  constructor(
    private authService: AuthService,
    private configurationService: ConfigurationService
  ) {}

  /**
   * Create a DataManager with current authentication headers
   */
  createDataManager(endpoint: string): DataManager {
    return new DataManager({
      url: `${this.configurationService.baseUrl}${endpoint}`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
      headers: this.getCurrentHeaders()
    });
  }

  /**
   * Update headers on an existing DataManager
   */
  updateDataManagerHeaders(dataManager: DataManager): void {
    if (dataManager && dataManager.dataSource) {
      dataManager.dataSource.headers = this.getCurrentHeaders();
    }
  }

  /**
   * Get current authentication headers
   */
  getCurrentHeaders(): { [key: string]: string }[] {
    const token = this.authService.accessToken;
    
    if (token) {
      return [
        { 'Authorization': `Bearer ${token}` },
        { 'Content-Type': 'application/json' },
        { 'Accept': 'application/json, text/plain, */*' }
      ];
    }
    
    return [
      { 'Content-Type': 'application/json' },
      { 'Accept': 'application/json, text/plain, */*' }
    ];
  }

  /**
   * Check if token needs refresh and update DataManager accordingly
   */
  refreshDataManagerTokenIfNeeded(dataManager: DataManager): void {
    // Check if token is expired or expiring soon
    if (this.authService.isSessionExpired) {
      console.log('Token expired, refreshing...');
      this.authService.refreshLogin().subscribe({
        next: () => {
          this.updateDataManagerHeaders(dataManager);
          console.log('DataManager headers updated after token refresh');
        },
        error: (error) => {
          console.error('Token refresh failed:', error);
          this.authService.reLogin();
        }
      });
    } else {
      // Just update headers with current token
      this.updateDataManagerHeaders(dataManager);
    }
  }
}