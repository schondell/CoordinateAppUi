import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest, WorkOrderSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/workorder.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderRepositoryService extends EndpointBase {
  private readonly workOrderUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.workOrderUrl = configurations.baseUrl + '/api/WorkOrder/';
  }

  /**
   * Get all work orders for the current tenant
   */
  getAllWorkOrders(): Observable<WorkOrder[]> {
    const endpointUrl = `${this.workOrderUrl}`;
    return this.http.get<WorkOrder[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllWorkOrders());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getWorkOrdersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<WorkOrder>> {
    const endpointUrl = `${this.workOrderUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<WorkOrder>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrdersForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchWorkOrders(
    search?: string,
    title?: string,
    description?: string,
    sortBy: string = 'title',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<WorkOrderSearchResponse> {
    const endpointUrl = `${this.workOrderUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (title) params.title = title;
    if (description) params.description = description;

    return this.http.get<WorkOrderSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchWorkOrders(search, title, description, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single work order by ID
   */
  getWorkOrderById(id: number): Observable<WorkOrder> {
    const endpointUrl = `${this.workOrderUrl}${id}`;
    return this.http.get<WorkOrder>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrderById(id));
      })
    );
  }

  /**
   * Create a new work order
   */
  createWorkOrder(workOrder: WorkOrderCreateRequest): Observable<WorkOrder> {
    const endpointUrl = `${this.workOrderUrl}`;
    return this.http.post<WorkOrder>(endpointUrl, workOrder, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createWorkOrder(workOrder));
      })
    );
  }

  /**
   * Update an existing work order
   */
  updateWorkOrder(id: number, workOrder: WorkOrderUpdateRequest): Observable<void> {
    const endpointUrl = `${this.workOrderUrl}${id}`;
    return this.http.put<void>(endpointUrl, workOrder, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateWorkOrder(id, workOrder));
      })
    );
  }

  /**
   * Delete a work order
   */
  deleteWorkOrder(id: number): Observable<void> {
    const endpointUrl = `${this.workOrderUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteWorkOrder(id));
      })
    );
  }
}