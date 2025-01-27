import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';
import { Cacheable } from 'ts-cacheable';
import { of } from 'rxjs';
import {delay, catchError, switchMap} from 'rxjs/operators';
import { IVehicleDtoApi, IVehicleDto } from '../../models/generatedtypes';
import {IDropDownItemWithDate} from "../../models/DropDownItemWithDate";

@Injectable({providedIn: 'root'})
export class VehicleRepository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/VehicleDto/';

  @Cacheable()
  getVehicleById(id: number): Observable<IVehicleDto> {
    const endpointUrl = this.itemUrl + 'GetVehicleDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return of(null).pipe(
          delay(1000),
          switchMap(() => this.handleError(error, () => this.getVehicleById(id)))
        );
      })
    );
  }

  @Cacheable()
  getAllVehicles(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<IVehicleDtoApi> {
    if (filter === undefined || filter === null || filter === '') {
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

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeVehicleDto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllVehicleDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return of(null).pipe(
          delay(1000),
          switchMap(() => this.handleError(error, () => this.getAllVehicles(filter, sortActive, sortOrder, page, pageSize)))
        );
      })
    );
  }

  @Cacheable()
  getVehiclesDropDownItems(): Observable<IDropDownItemWithDate[]> {
     const itemUrl: string =this.configurations.baseUrl + '/api/VehicleSummary/';
    const endpointUrl = itemUrl + 'GetNameAndIdForVehicleWithDate';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return of(null).pipe(
          delay(1000),
          switchMap(() => this.handleError(error, () => this.getVehiclesDropDownItems()))
        );
      })
    );
  }
  }
