import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from './configuration.service';

/**
 * SecureStorageService - A service for securely storing authentication tokens using HttpOnly cookies
 * This is a more secure alternative to localStorage for sensitive tokens like JWT
 */
@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private apiEndpoint: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.apiEndpoint = this.configurationService.baseUrl;
  }

  /**
   * Stores a token in an HttpOnly cookie via a server endpoint
   * @param key The key/name for the cookie
   * @param value The value to store
   * @param expireDays Days until cookie expires
   */
  async setSecureCookie(key: string, value: string, expireDays: number = 7): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiEndpoint}/api/auth/cookie`, {
          key,
          value,
          expireDays
        })
      );
      return response.success;
    } catch (error) {
      console.error('Error setting secure cookie:', error);
      return false;
    }
  }

  /**
   * Removes a secure cookie via a server endpoint
   * @param key The key/name of the cookie to remove
   */
  async removeSecureCookie(key: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{ success: boolean }>(`${this.apiEndpoint}/api/auth/cookie?key=${key}`)
      );
      return response.success;
    } catch (error) {
      console.error('Error removing secure cookie:', error);
      return false;
    }
  }
}