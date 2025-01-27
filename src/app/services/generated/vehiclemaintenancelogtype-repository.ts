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


import { IVehicleMaintenanceLogTypeDtoApi, IVehicleMaintenanceLogTypeDto } from '../../models/generatedtypes';

@Injectable({providedIn: 'root'})
export class VehicleMaintenanceLogTypeRepository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/VehicleMaintenanceLogTypeDto/';

    getVehicleMaintenanceLogTypeById(id: number): Observable<IVehicleMaintenanceLogTypeDto> {
    const endpointUrl =  this.itemUrl + 'GetVehicleMaintenanceLogTypeDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleMaintenanceLogTypeById(id));
      }));
  }

  getAllVehicleMaintenanceLogTypes(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<IVehicleMaintenanceLogTypeDtoApi> {
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

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeVehicleMaintenanceLogTypeDto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllVehicleMaintenanceLogTypeDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllVehicleMaintenanceLogTypes(filter, sortActive, sortOrder, page, pageSize));
      }));
  }

      getVehicleMaintenanceLogTypesDropDownItems(): Observable<IDropDownItem[]> {
    const endpointUrl = this.itemUrl + 'GetNameAndIdForVehicleMaintenanceLogType';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleMaintenanceLogTypesDropDownItems());
      }));
  }
  }
