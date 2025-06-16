import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest, WorkOrderStatus, WorkOrderPriority } from '../models/workorder.model';
import { WorkOrderRepositoryService } from './workorder-repository.service';
import { AlertService, MessageSeverity } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private workOrdersSubject = new BehaviorSubject<WorkOrder[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedWorkOrderSubject = new BehaviorSubject<WorkOrder | null>(null);

  public workOrders$ = this.workOrdersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public selectedWorkOrder$ = this.selectedWorkOrderSubject.asObservable();

  constructor(
    private workOrderRepository: WorkOrderRepositoryService,
    private alertService: AlertService
  ) {}

  /**
   * Load all work orders
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
        this.alertService.showMessage(
          'Error Loading Work Orders',
          error.message || 'Failed to load work orders',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Get work order by ID
   */
  getWorkOrderById(id: number): Observable<WorkOrder> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.getWorkOrderById(id).pipe(
      tap(workOrder => {
        this.selectedWorkOrderSubject.next(workOrder);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Loading Work Order',
          error.message || 'Failed to load work order details',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new work order
   */
  createWorkOrder(workOrderData: WorkOrderCreateRequest): Observable<WorkOrder> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.createWorkOrder(workOrderData).pipe(
      tap(newWorkOrder => {
        const currentWorkOrders = this.workOrdersSubject.value;
        this.workOrdersSubject.next([...currentWorkOrders, newWorkOrder]);
        this.selectedWorkOrderSubject.next(newWorkOrder);
        this.loadingSubject.next(false);
        
        this.alertService.showMessage(
          'Work Order Created',
          `Work order ${newWorkOrder.orderNumber} has been created successfully`,
          MessageSeverity.success
        );
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Creating Work Order',
          error.message || 'Failed to create work order',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing work order
   */
  updateWorkOrder(id: number, workOrderData: WorkOrderUpdateRequest): Observable<WorkOrder> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.updateWorkOrder(id, workOrderData).pipe(
      tap(updatedWorkOrder => {
        const currentWorkOrders = this.workOrdersSubject.value;
        const updatedWorkOrders = currentWorkOrders.map(wo => 
          wo.id === id ? updatedWorkOrder : wo
        );
        this.workOrdersSubject.next(updatedWorkOrders);
        this.selectedWorkOrderSubject.next(updatedWorkOrder);
        this.loadingSubject.next(false);
        
        this.alertService.showMessage(
          'Work Order Updated',
          `Work order ${updatedWorkOrder.orderNumber} has been updated successfully`,
          MessageSeverity.success
        );
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Updating Work Order',
          error.message || 'Failed to update work order',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete work order
   */
  deleteWorkOrder(id: number): Observable<void> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.deleteWorkOrder(id).pipe(
      tap(() => {
        const currentWorkOrders = this.workOrdersSubject.value;
        const filteredWorkOrders = currentWorkOrders.filter(wo => wo.id !== id);
        this.workOrdersSubject.next(filteredWorkOrders);
        
        // Clear selected work order if it was deleted
        const selectedWorkOrder = this.selectedWorkOrderSubject.value;
        if (selectedWorkOrder && selectedWorkOrder.id === id) {
          this.selectedWorkOrderSubject.next(null);
        }
        
        this.loadingSubject.next(false);
        
        this.alertService.showMessage(
          'Work Order Deleted',
          'Work order has been deleted successfully',
          MessageSeverity.success
        );
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Deleting Work Order',
          error.message || 'Failed to delete work order',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Search work orders with filters
   */
  searchWorkOrders(filters: {
    orderNumber?: string;
    customerId?: number;
    status?: WorkOrderStatus;
    priority?: WorkOrderPriority;
    assignedTo?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<WorkOrder[]> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.searchWorkOrders(filters).pipe(
      map(response => response.workOrders),
      tap(workOrders => {
        this.workOrdersSubject.next(workOrders);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Searching Work Orders',
          error.message || 'Failed to search work orders',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Update work order status
   */
  updateWorkOrderStatus(id: number, status: WorkOrderStatus): Observable<WorkOrder> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.updateWorkOrderStatus(id, status).pipe(
      tap(updatedWorkOrder => {
        const currentWorkOrders = this.workOrdersSubject.value;
        const updatedWorkOrders = currentWorkOrders.map(wo => 
          wo.id === id ? updatedWorkOrder : wo
        );
        this.workOrdersSubject.next(updatedWorkOrders);
        this.loadingSubject.next(false);
        
        this.alertService.showMessage(
          'Status Updated',
          `Work order status changed to ${status}`,
          MessageSeverity.success
        );
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Updating Status',
          error.message || 'Failed to update work order status',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Assign work order to user
   */
  assignWorkOrder(id: number, assignedTo: number): Observable<WorkOrder> {
    this.loadingSubject.next(true);
    
    return this.workOrderRepository.assignWorkOrder(id, assignedTo).pipe(
      tap(updatedWorkOrder => {
        const currentWorkOrders = this.workOrdersSubject.value;
        const updatedWorkOrders = currentWorkOrders.map(wo => 
          wo.id === id ? updatedWorkOrder : wo
        );
        this.workOrdersSubject.next(updatedWorkOrders);
        this.loadingSubject.next(false);
        
        this.alertService.showMessage(
          'Work Order Assigned',
          `Work order has been assigned successfully`,
          MessageSeverity.success
        );
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.alertService.showMessage(
          'Error Assigning Work Order',
          error.message || 'Failed to assign work order',
          MessageSeverity.error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Select work order
   */
  selectWorkOrder(workOrder: WorkOrder | null): void {
    this.selectedWorkOrderSubject.next(workOrder);
  }

  /**
   * Clear selected work order
   */
  clearSelection(): void {
    this.selectedWorkOrderSubject.next(null);
  }

  /**
   * Get current work orders snapshot
   */
  getCurrentWorkOrders(): WorkOrder[] {
    return this.workOrdersSubject.value;
  }

  /**
   * Get current selected work order snapshot
   */
  getCurrentSelectedWorkOrder(): WorkOrder | null {
    return this.selectedWorkOrderSubject.value;
  }

  /**
   * Refresh work orders
   */
  refreshWorkOrders(): Observable<WorkOrder[]> {
    return this.loadAllWorkOrders();
  }
}