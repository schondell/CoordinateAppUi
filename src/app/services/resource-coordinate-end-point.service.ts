import { Injectable, Injector } from '@angular/core';
import { EndpointFactory } from "./endpoint-factory.service";
import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "./configuration.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { WorkItem, WorkItemDto } from '../models/generatedtypes';
import {AuthService} from "./auth.service";
import {EndpointBase} from "./endpoint-base.service";

@Injectable({providedIn: 'root'})
export class ResourceCoordinateRepository extends EndpointBase{
  private readonly itemUrl: string;

  constructor(http: HttpClient, configurations: ConfigurationService, authService: AuthService) {
    super(http, authService);
    this.itemUrl = configurations.baseUrl + '/api/WorkItemDto/GetAllUnassignedWorkItemDto';
  }

  private readonly _workItemUrl: string = "/api/WorkItemDto/GetAllUnassignedWorkItemDto";

  getWorkItemsEndpoint(filter: string = '', sortOrder: string = 'asc', page?: number, pageSize?: number): Observable<WorkItemDto[]> {

    const endpointUrl = page > -1 && pageSize > 0 ? `${this._workItemUrl}?filter=${filter}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}` : this._workItemUrl;

    return this.http.get(endpointUrl, super.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getWorkItemsEndpoint(filter, sortOrder, page, pageSize));
      }));
  }


  getWorkItemUnassignedCount(): Observable<number> {

    const endpointUrl = "/api/WorkItemDto/GetNumberOfUnassignedWorkItems";

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getWorkItemUnassignedCount());
      }));
  }

  getAllActiveWorkItem(page?: number, pageSize?: number): Observable<WorkItem[]> {

    const endpointUrl = "/api/WorkItem/GetAllWorkItem";

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllActiveWorkItem());
      }));
  }

}
