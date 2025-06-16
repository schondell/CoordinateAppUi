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
   * Search work orders with filters
   */
  searchWorkOrders(params: {
    orderNumber?: string;
    customerId?: number;
    status?: string;
    priority?: string;
    assignedTo?: number;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    pageSize?: number;
  }): Observable<{ workOrders: WorkOrder[], totalCount: number }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          httpParams = httpParams.set(key, value.toISOString());
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return this.http.get<{ workOrders: WorkOrder[], totalCount: number }>(
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
   * Get work orders by customer
   */
  getWorkOrdersByCustomer(customerId: number): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Get work orders by vehicle
   */
  getWorkOrdersByVehicle(vehicleId: number): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  /**
   * Get work orders assigned to user
   */
  getAssignedWorkOrders(userId: number): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(`${this.apiUrl}/assigned/${userId}`);
  }

  /**
   * Update work order status
   */
  updateWorkOrderStatus(id: number, status: string): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Assign work order to user
   */
  assignWorkOrder(id: number, assignedTo: number): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}/assign`, { assignedTo });
  }
}