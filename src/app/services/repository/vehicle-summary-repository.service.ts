import {Injectable, Injector} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleSummary } from '../../models/vehicle-summary';
import {ConfigurationService} from "../configuration.service";
import {catchError} from "rxjs/operators";
import {EndpointBase} from "../endpoint-base.service";
import {AuthService} from "../auth.service";
@Injectable({
  providedIn: 'root',
})

export class VehicleSummaryRepositoryService extends EndpointBase {
  private readonly itemUrl: string;

  constructor(http: HttpClient, configurations: ConfigurationService, authService: AuthService) {
    super(http, authService);
    this.itemUrl = configurations.baseUrl + '/api/VehicleSummary/';
  }

  getAllVehicleSummaries(): Observable<VehicleSummary[]> {
    const endpointUrl = `${this.itemUrl}GetAllVehicleSummary`;
    return this.http.get<VehicleSummary[]>(endpointUrl, this.getRequestHeaders()).pipe(catchError(error => {
      return this.handleError(error, () => this.getAllVehicleSummaries());
    }));
  }
}
