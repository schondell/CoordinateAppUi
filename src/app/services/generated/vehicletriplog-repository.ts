// Auto-generated file, do not modify
//
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from '../configuration.service';
import { IDropDownItem } from '../../models/DropDownItem';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';


import { IVehicleTripLogDtoApi, IVehicleTripLogDto } from '../../models/generatedtypes';

@Injectable({providedIn: 'root'})
export class VehicleTripLogRepository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/VehicleTripLogDto/';

    getVehicleTripLogById(id: number): Observable<IVehicleTripLogDto> {
    const endpointUrl =  this.itemUrl + 'GetVehicleTripLogDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleTripLogById(id));
      }));
  }

  getAllVehicleTripLogs(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<IVehicleTripLogDtoApi> {
    if (filter === undefined || filter === null) {
      filter = 'none';
    }

    if (sortActive === undefined || sortActive === null) {
      sortActive = '';
    }

    if (sortOrder === undefined || sortOrder === null) {
      sortOrder = 'asc';
    }

    if (page === undefined || page === null) {
      page = 0;
    }

    if (pageSize === undefined || pageSize === null) {
      pageSize = 10;
    }

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeVehicleTripLogDto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllVehicleTripLogDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllVehicleTripLogs(filter, sortActive, sortOrder, page, pageSize));
      }));
  }

      getVehicleTripLogsDropDownItems(): Observable<IDropDownItem[]> {
    const endpointUrl = this.itemUrl + 'GetNameAndIdForVehicleTripLog';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleTripLogsDropDownItems());
      }));
  }
  }
