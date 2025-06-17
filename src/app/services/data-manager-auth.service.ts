import { Injectable } from '@angular/core';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { Subject, BehaviorSubject } from 'rxjs';

export interface DataManagerConfig {
  endpoint: string;
  dataManager?: DataManager;
  componentName?: string;
}

/**
 * Service to manage Syncfusion DataManager instances with dynamic JWT authentication
 * Centralizes token refresh logic and updates all registered DataManager instances
 */
@Injectable({
  providedIn: 'root'
})
export class DataManagerAuthService {
  private registeredDataManagers = new Map<string, DataManager>();
  private tokenRefreshSubject = new Subject<string>();
  
  constructor(
    private authService: AuthService,
    private configurationService: ConfigurationService
  ) {
    // Listen for authentication status changes
    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.refreshAllDataManagerTokens();
      } else {
        this.clearAllDataManagerTokens();
      }
    });
  }

  /**
   * Create a new DataManager with dynamic authentication
   */
  createDataManager(config: DataManagerConfig): DataManager {
    const dataManager = new DataManager({
      url: `${this.configurationService.baseUrl}${config.endpoint}`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
      headers: this.getCurrentHeaders()
    });

    // Register this DataManager for token updates
    const key = config.componentName || config.endpoint;
    this.registeredDataManagers.set(key, dataManager);

    return dataManager;
  }

  /**
   * Get current authentication headers
   */
  private getCurrentHeaders(): { [key: string]: string }[] {
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
   * Refresh JWT tokens for all registered DataManager instances
   */
  refreshAllDataManagerTokens(): void {
    const newHeaders = this.getCurrentHeaders();
    
    this.registeredDataManagers.forEach((dataManager, key) => {
      if (dataManager && dataManager.dataSource) {
        dataManager.dataSource.headers = newHeaders;
        console.log(`Updated headers for DataManager: ${key}`);
      }
    });

    // Notify subscribers about token refresh
    const token = this.authService.accessToken;
    if (token) {
      this.tokenRefreshSubject.next(token);
    }
  }

  /**
   * Clear tokens from all DataManager instances (on logout)
   */
  private clearAllDataManagerTokens(): void {
    const headersWithoutAuth = [
      { 'Content-Type': 'application/json' },
      { 'Accept': 'application/json, text/plain, */*' }
    ];

    this.registeredDataManagers.forEach((dataManager) => {
      if (dataManager && dataManager.dataSource) {
        dataManager.dataSource.headers = headersWithoutAuth;
      }
    });
  }

  /**
   * Update headers for a specific DataManager
   */
  updateDataManagerHeaders(key: string): void {
    const dataManager = this.registeredDataManagers.get(key);
    if (dataManager && dataManager.dataSource) {
      dataManager.dataSource.headers = this.getCurrentHeaders();
    }
  }

  /**
   * Unregister a DataManager (cleanup)
   */
  unregisterDataManager(key: string): void {
    this.registeredDataManagers.delete(key);
  }

  /**
   * Get notification when token is refreshed
   */
  getTokenRefreshEvent() {
    return this.tokenRefreshSubject.asObservable();
  }

  /**
   * Manually trigger token refresh for all DataManagers
   */
  triggerTokenRefresh(): void {
    this.refreshAllDataManagerTokens();
  }
}