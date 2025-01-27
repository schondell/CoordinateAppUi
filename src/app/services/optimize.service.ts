import { Injectable, Injector} from '@angular/core';
import { EndpointFactory } from './endpoint-factory.service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { IRouteInput, IRouteResponse } from '../models/IRouteInput';


@Injectable({ providedIn: 'root' })

export class OptimizeService extends EndpointFactory {

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }


  postRouteForOptimization<T>(routeInput: IRouteInput): Observable<T> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });

    const endpointUrl = '/api/Optimize/OptimizeRoute';

    return this.http.post<T>(endpointUrl, JSON.stringify(routeInput), { headers: header }).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.postRouteForOptimization(routeInput));
      }));
  }

  postRoute(routeInput: IRouteInput): Observable<IRouteResponse> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });

    const endpointUrl = '/api/Optimize/Route';

    return this.http.post(endpointUrl, JSON.stringify(routeInput), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.postRouteForOptimization(routeInput));
      }));
  }

}
