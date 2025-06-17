import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest, WorkOrderSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/workorder.model';
import { WorkOrderRepositoryService } from './repository/workorder-repository.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private workOrdersSubject = new BehaviorSubject<WorkOrder[]>([]);
  public workOrders$ = this.workOrdersSubject.asObservable();

  private selectedWorkOrderSubject = new BehaviorSubject<WorkOrder | null>(null);
  public selectedWorkOrder$ = this.selectedWorkOrderSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private workOrderRepository: WorkOrderRepositoryService) {}

  /**
   * Get all work orders and update the local cache
   */
  loadAllWorkOrders(): Observable<WorkOrder[]> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.getAllWorkOrders().pipe(
      tap(workOrders => {
        this.workOrdersSubject.next(workOrders);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading work orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get work orders for Syncfusion DataGrid with server-side operations
   */
  getWorkOrdersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<WorkOrder>> {
    return this.workOrderRepository.getWorkOrdersForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting work orders for DataGrid:', error);
        return throwError(() => error);
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
    return this.workOrderRepository.searchWorkOrders(
      search, title, description, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching work orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific work order by ID
   */
  getWorkOrderById(id: number): Observable<WorkOrder> {
    return this.workOrderRepository.getWorkOrderById(id).pipe(
      tap(workOrder => {
        this.selectedWorkOrderSubject.next(workOrder);
      }),
      catchError(error => {
        console.error(`Error getting work order ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new work order
   */
  createWorkOrder(workOrderRequest: WorkOrderCreateRequest): Observable<WorkOrder> {
    this.loadingSubject.next(true);

    return this.workOrderRepository.createWorkOrder(workOrderRequest).pipe(
      tap(newWorkOrder => {
        // Add the new work order to the local cache
        const currentWorkOrders = this.workOrdersSubject.value;
        this.workOrdersSubject.next([...currentWorkOrders, newWorkOrder]);
        this.selectedWorkOrderSubject.next(newWorkOrder);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating work order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing work order
   */
  updateWorkOrder(id: number, workOrderRequest: WorkOrderUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.workOrderRepository.updateWorkOrder(id, workOrderRequest).pipe(
      tap(() => {
        // Update the work order in the local cache
        const currentWorkOrders = this.workOrdersSubject.value;
        const updatedWorkOrders = currentWorkOrders.map(workOrder => 
          workOrder.id === id ? { ...workOrder, ...workOrderRequest } : workOrder
        );
        this.workOrdersSubject.next(updatedWorkOrders);
        
        // Update selected work order if it's the one being updated
        const selectedWorkOrder = this.selectedWorkOrderSubject.value;
        if (selectedWorkOrder && selectedWorkOrder.id === id) {
          this.selectedWorkOrderSubject.next({ ...selectedWorkOrder, ...workOrderRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating work order ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a work order
   */
  deleteWorkOrder(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.workOrderRepository.deleteWorkOrder(id).pipe(
      tap(() => {
        // Remove the work order from the local cache
        const currentWorkOrders = this.workOrdersSubject.value;
        const filteredWorkOrders = currentWorkOrders.filter(workOrder => workOrder.id !== id);
        this.workOrdersSubject.next(filteredWorkOrders);
        
        // Clear selected work order if it's the one being deleted
        const selectedWorkOrder = this.selectedWorkOrderSubject.value;
        if (selectedWorkOrder && selectedWorkOrder.id === id) {
          this.selectedWorkOrderSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting work order ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected work order
   */
  setSelectedWorkOrder(workOrder: WorkOrder | null): void {
    this.selectedWorkOrderSubject.next(workOrder);
  }

  /**
   * Get the currently selected work order (synchronous)
   */
  getSelectedWorkOrder(): WorkOrder | null {
    return this.selectedWorkOrderSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.workOrdersSubject.next([]);
    this.selectedWorkOrderSubject.next(null);
  }

  /**
   * Refresh work orders data
   */
  refreshWorkOrders(): Observable<WorkOrder[]> {
    return this.loadAllWorkOrders();
  }

  /**
   * Get work orders count
   */
  getWorkOrdersCount(): number {
    return this.workOrdersSubject.value.length;
  }

  /**
   * Filter work orders by search term (local cache)
   */
  filterWorkOrdersLocal(searchTerm: string): WorkOrder[] {
    if (!searchTerm.trim()) {
      return this.workOrdersSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.workOrdersSubject.value.filter(workOrder =>
      workOrder.title.toLowerCase().includes(term) ||
      workOrder.description?.toLowerCase().includes(term)
    );
  }
}