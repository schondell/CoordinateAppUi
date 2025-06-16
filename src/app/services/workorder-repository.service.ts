import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest } from '../models/workorder.model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderRepositoryService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.apiUrl = `${this.configService.baseUrl}/api/workorders`;
  }

  /**
   * Get all work orders
   */
  getAllWorkOrders(): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(this.apiUrl);
  }

  /**
   * Get work order by ID
   */
  getWorkOrderById(id: number): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search work orders with filters - matches the backend API
   */
  searchWorkOrders(params: {
    search?: string;
    title?: string;
    description?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    pageSize?: number;
  }): Observable<{ data: WorkOrder[], totalCount: number, page: number, pageSize: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<{ data: WorkOrder[], totalCount: number, page: number, pageSize: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean }>(
      `${this.apiUrl}/search`, 
      { params: httpParams }
    );
  }

  /**
   * Create new work order
   */
  createWorkOrder(workOrder: WorkOrderCreateRequest): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.apiUrl, workOrder);
  }

  /**
   * Update existing work order
   */
  updateWorkOrder(id: number, workOrder: WorkOrderUpdateRequest): Observable<WorkOrder> {
    return this.http.put<WorkOrder>(`${this.apiUrl}/${id}`, workOrder);
  }

  /**
   * Delete work order
   */
  deleteWorkOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Syncfusion Grid Data Manager endpoint for server-side operations
   */
  getGridData(dataManagerRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UrlDatasource`, dataManagerRequest);
  }
}