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


import { IGpsTrackerSmsCommandDtoApi, IGpsTrackerSmsCommandDto } from '../../models/generatedtypes';

@Injectable({providedIn: 'root'})
export class GpsTrackerSmsCommandRepository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/GpsTrackerSmsCommandDto/';

    getGpsTrackerSmsCommandById(id: number): Observable<IGpsTrackerSmsCommandDto> {
    const endpointUrl =  this.itemUrl + 'GetGpsTrackerSmsCommandDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getGpsTrackerSmsCommandById(id));
      }));
  }

  getAllGpsTrackerSmsCommands(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<IGpsTrackerSmsCommandDtoApi> {
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

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeGpsTrackerSmsCommandDto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllGpsTrackerSmsCommandDto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllGpsTrackerSmsCommands(filter, sortActive, sortOrder, page, pageSize));
      }));
  }

      getGpsTrackerSmsCommandsDropDownItems(): Observable<IDropDownItem[]> {
    const endpointUrl = this.itemUrl + 'GetNameAndIdForGpsTrackerSmsCommand';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getGpsTrackerSmsCommandsDropDownItems());
      }));
  }
  }
