import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {EndpointBase} from "./endpoint-base.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class NotifyService extends EndpointBase {
  private readonly itemUrl: string;

  constructor(configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
    this.itemUrl = configurations.baseUrl + '/api/Notify/';
  }

  postNotification<T>(message: string): Observable<T> {
    const header = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const endpointUrl = `${this.itemUrl}NotifyAsync`;

    return this.http.post<T>(endpointUrl, message, { headers: header }).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.postNotification<T>(message));
      }));
  }
}
