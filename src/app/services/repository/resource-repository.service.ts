import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Resource, ResourceCreateRequest, ResourceUpdateRequest, ResourceSearchResponse } from '../../models/resource.model';
import { DataManagerRequest, DataManagerResponse } from '../../models/vehicle.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceRepositoryService extends EndpointBase {
  private readonly resourceUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService,
    router: Router
  ) {
    super(http, authService, router);
    this.resourceUrl = configurations.baseUrl + '/api/Resource/';
  }

  /**
   * Get all resources for the current tenant
   */
  getAllResources(): Observable<Resource[]> {
    const endpointUrl = `${this.resourceUrl}`;
    return this.http.get<Resource[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllResources());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getResourcesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Resource>> {
    const endpointUrl = `${this.resourceUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<Resource>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getResourcesForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchResources(
    search?: string,
    name?: string,
    resourceType?: string,
    category?: string,
    status?: string,
    location?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<ResourceSearchResponse> {
    const endpointUrl = `${this.resourceUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (resourceType) params.resourceType = resourceType;
    if (category) params.category = category;
    if (status) params.status = status;
    if (location) params.location = location;

    return this.http.get<ResourceSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchResources(search, name, resourceType, category, status, location, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single resource by ID
   */
  getResourceById(id: number): Observable<Resource> {
    const endpointUrl = `${this.resourceUrl}${id}`;
    return this.http.get<Resource>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getResourceById(id));
      })
    );
  }

  /**
   * Create a new resource
   */
  createResource(resource: ResourceCreateRequest): Observable<Resource> {
    const endpointUrl = `${this.resourceUrl}`;
    return this.http.post<Resource>(endpointUrl, resource, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createResource(resource));
      })
    );
  }

  /**
   * Update an existing resource
   */
  updateResource(id: number, resource: ResourceUpdateRequest): Observable<void> {
    const endpointUrl = `${this.resourceUrl}${id}`;
    return this.http.put<void>(endpointUrl, resource, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateResource(id, resource));
      })
    );
  }

  /**
   * Delete a resource
   */
  deleteResource(id: number): Observable<void> {
    const endpointUrl = `${this.resourceUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteResource(id));
      })
    );
  }

  /**
   * Get resources for dropdown/lookup purposes
   */
  getResourcesDropdown(): Observable<{ id: number; name: string }[]> {
    const endpointUrl = `${this.resourceUrl}dropdown`;
    return this.http.get<{ id: number; name: string }[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getResourcesDropdown());
      })
    );
  }
}