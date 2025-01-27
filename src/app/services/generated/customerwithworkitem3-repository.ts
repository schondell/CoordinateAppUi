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


import { ICustomerWithWorkItem3DtoApi, ICustomerWithWorkItem3Dto } from '../../models/generatedtypes';

@Injectable({providedIn: 'root'})
export class CustomerWithWorkItem3Repository extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }

  private readonly itemUrl: string =this.configurations.baseUrl + '/api/CustomerWithWorkItem3Dto/';

    getCustomerWithWorkItem3ById(id: number): Observable<ICustomerWithWorkItem3Dto> {
    const endpointUrl =  this.itemUrl + 'GetCustomerWithWorkItem3Dto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomerWithWorkItem3ById(id));
      }));
  }

  getAllCustomerWithWorkItem3s(filter: string = '', sortActive: string, sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<ICustomerWithWorkItem3DtoApi> {
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

    const endpointUrl = page > -1 && pageSize > 0  ? `${this.itemUrl}GetRangeCustomerWithWorkItem3Dto?filter=${filter}&sortOrder=asc&page=${page}&pageSize=${pageSize}`
      : this.itemUrl + 'GetAllCustomerWithWorkItem3Dto';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllCustomerWithWorkItem3s(filter, sortActive, sortOrder, page, pageSize));
      }));
  }

      getCustomerWithWorkItem3sDropDownItems(): Observable<IDropDownItem[]> {
    const endpointUrl = this.itemUrl + 'GetNameAndIdForCustomerWithWorkItem3';

    return this.http.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomerWithWorkItem3sDropDownItems());
      }));
  }
  }
