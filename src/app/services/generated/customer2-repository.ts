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


import { ICustomer2DtoApi, ICustomer2Dto } from '../../models/generatedtypes';

@Injectable({providedIn: 'root'})
export class Customer2Repository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/Customer2Dto/';

    getCustomer2ById(id: number): Observable<ICustomer2Dto> {
    const endpointUrl =  this.itemUrl + 'GetCustomer2Dto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomer2ById(id));
      }));
  }

  getAllCustomer2s(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<ICustomer2DtoApi> {
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

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeCustomer2Dto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllCustomer2Dto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllCustomer2s(filter, sortActive, sortOrder, page, pageSize));
      }));
  }

      getCustomer2sDropDownItems(): Observable<IDropDownItem[]> {
    const endpointUrl = this.itemUrl + 'GetNameAndIdForCustomer2';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomer2sDropDownItems());
      }));
  }
  }
