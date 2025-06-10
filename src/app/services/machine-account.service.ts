import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service';
import { AuthService } from './auth.service';
import { 
  MachineAccount, 
  MachineAccountCreateRequest, 
  MachineAccountUpdateRequest,
  AvailableScopes,
  MachineScope 
} from '../models/machine-account.model';

export interface MachineAccountListResponse {
  machineAccounts: MachineAccount[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class MachineAccountService {
  
  constructor(
    private http: HttpClient,
    private configurations: ConfigurationService,
    private authService: AuthService
  ) { }

  get baseUrl(): string {
    return this.configurations.baseUrl;
  }

  private getRequestHeaders(): { headers: HttpHeaders } {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.accessToken}`
    });
    return { headers };
  }

  // Get all machine accounts
  getMachineAccounts(): Observable<MachineAccount[]> {
    const url = `${this.baseUrl}/api/MachineAccount`;
    
    return this.http.get<MachineAccountListResponse>(url, this.getRequestHeaders())
      .pipe(
        map(response => response.machineAccounts || []),
        catchError(this.handleError)
      );
  }

  // Get machine account by ID
  getMachineAccount(id: string): Observable<MachineAccount> {
    const url = `${this.baseUrl}/api/MachineAccount/${id}`;
    
    return this.http.get<MachineAccount>(url, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create new machine account
  createMachineAccount(machineAccount: MachineAccountCreateRequest): Observable<MachineAccount> {
    const url = `${this.baseUrl}/api/MachineAccount`;
    
    return this.http.post<MachineAccount>(url, machineAccount, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update machine account
  updateMachineAccount(machineAccount: MachineAccountUpdateRequest): Observable<MachineAccount> {
    const url = `${this.baseUrl}/api/MachineAccount/${machineAccount.id}`;
    
    return this.http.put<MachineAccount>(url, machineAccount, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete machine account
  deleteMachineAccount(id: string): Observable<void> {
    const url = `${this.baseUrl}/api/MachineAccount/${id}`;
    
    return this.http.delete<void>(url, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Regenerate client secret
  regenerateSecret(id: string): Observable<{ clientSecret: string }> {
    const url = `${this.baseUrl}/api/MachineAccount/${id}/regenerate-secret`;
    
    return this.http.post<{ clientSecret: string }>(url, {}, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get available scopes for machine accounts
  getAvailableScopes(): Observable<MachineScope[]> {
    // For now, return static scopes. In the future, this could be fetched from the API
    return new Observable<MachineScope[]>(observer => {
      observer.next(AvailableScopes);
      observer.complete();
    });
  }

  // Test machine account connectivity
  testMachineAccount(id: string): Observable<{ success: boolean; message: string }> {
    const url = `${this.baseUrl}/api/MachineAccount/${id}/test`;
    
    return this.http.post<{ success: boolean; message: string }>(url, {}, this.getRequestHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Unauthorized access';
      } else if (error.status === 403) {
        errorMessage = 'Insufficient permissions';
      } else if (error.status === 404) {
        errorMessage = 'Machine account not found';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}