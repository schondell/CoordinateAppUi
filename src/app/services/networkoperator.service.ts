import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { NetworkOperator, NetworkOperatorCreateRequest, NetworkOperatorUpdateRequest, NetworkOperatorSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/networkoperator.model';
import { NetworkOperatorRepositoryService } from './repository/networkoperator-repository.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkOperatorService {
  private networkOperatorsSubject = new BehaviorSubject<NetworkOperator[]>([]);
  public networkOperators$ = this.networkOperatorsSubject.asObservable();

  private selectedNetworkOperatorSubject = new BehaviorSubject<NetworkOperator | null>(null);
  public selectedNetworkOperator$ = this.selectedNetworkOperatorSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private networkOperatorRepository: NetworkOperatorRepositoryService) {}

  /**
   * Get all network operators and update the local cache
   */
  loadAllNetworkOperators(): Observable<NetworkOperator[]> {
    this.loadingSubject.next(true);
    
    return this.networkOperatorRepository.getAllNetworkOperators().pipe(
      tap(networkOperators => {
        this.networkOperatorsSubject.next(networkOperators);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading network operators:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get network operators for Syncfusion DataGrid with server-side operations
   */
  getNetworkOperatorsForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<NetworkOperator>> {
    return this.networkOperatorRepository.getNetworkOperatorsForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting network operators for DataGrid:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchNetworkOperators(
    search?: string,
    name?: string,
    email?: string,
    phone?: string,
    contact?: string,
    vatNo?: string,
    apn?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<NetworkOperatorSearchResponse> {
    return this.networkOperatorRepository.searchNetworkOperators(
      search, name, email, phone, contact, vatNo, apn, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching network operators:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single network operator by ID
   */
  getNetworkOperatorById(id: number): Observable<NetworkOperator> {
    return this.networkOperatorRepository.getNetworkOperatorById(id).pipe(
      tap(networkOperator => {
        this.selectedNetworkOperatorSubject.next(networkOperator);
      }),
      catchError(error => {
        console.error(`Error getting network operator by ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new network operator
   */
  createNetworkOperator(networkOperatorRequest: NetworkOperatorCreateRequest): Observable<NetworkOperator> {
    this.loadingSubject.next(true);

    return this.networkOperatorRepository.createNetworkOperator(networkOperatorRequest).pipe(
      tap(newNetworkOperator => {
        // Add the new network operator to the local cache
        const currentNetworkOperators = this.networkOperatorsSubject.value;
        this.networkOperatorsSubject.next([...currentNetworkOperators, newNetworkOperator]);
        this.selectedNetworkOperatorSubject.next(newNetworkOperator);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating network operator:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing network operator
   */
  updateNetworkOperator(id: number, networkOperatorRequest: NetworkOperatorUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.networkOperatorRepository.updateNetworkOperator(id, networkOperatorRequest).pipe(
      tap(() => {
        // Update the network operator in the local cache
        const currentNetworkOperators = this.networkOperatorsSubject.value;
        const updatedNetworkOperators = currentNetworkOperators.map(no => 
          no.id === id ? { ...no, ...networkOperatorRequest } : no
        );
        this.networkOperatorsSubject.next(updatedNetworkOperators);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error updating network operator:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a network operator
   */
  deleteNetworkOperator(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.networkOperatorRepository.deleteNetworkOperator(id).pipe(
      tap(() => {
        // Remove the network operator from the local cache
        const currentNetworkOperators = this.networkOperatorsSubject.value;
        const filteredNetworkOperators = currentNetworkOperators.filter(no => no.id !== id);
        this.networkOperatorsSubject.next(filteredNetworkOperators);
        
        // Clear selection if the deleted network operator was selected
        if (this.selectedNetworkOperatorSubject.value?.id === id) {
          this.selectedNetworkOperatorSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error deleting network operator:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the selected network operator
   */
  setSelectedNetworkOperator(networkOperator: NetworkOperator | null): void {
    this.selectedNetworkOperatorSubject.next(networkOperator);
  }

  /**
   * Clear the selected network operator
   */
  clearSelectedNetworkOperator(): void {
    this.selectedNetworkOperatorSubject.next(null);
  }

  /**
   * Get network operators count
   */
  getNetworkOperatorsCount(): number {
    return this.networkOperatorsSubject.value.length;
  }

  /**
   * Check if a network operator exists by name
   */
  networkOperatorExistsByName(name: string): boolean {
    const networkOperators = this.networkOperatorsSubject.value;
    return networkOperators.some(networkOperator => 
      networkOperator.name?.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Search network operators in the local cache
   */
  searchNetworkOperatorsLocally(searchTerm: string): NetworkOperator[] {
    const networkOperators = this.networkOperatorsSubject.value;
    const term = searchTerm.toLowerCase();
    
    return networkOperators.filter(networkOperator =>
      networkOperator.name?.toLowerCase().includes(term) ||
      networkOperator.email?.toLowerCase().includes(term) ||
      networkOperator.phone?.toLowerCase().includes(term) ||
      networkOperator.contact?.toLowerCase().includes(term) ||
      networkOperator.vatNo?.toLowerCase().includes(term) ||
      networkOperator.apn?.toLowerCase().includes(term)
    );
  }

  /**
   * Get dropdown items for network operators
   */
  getDropdownItems(): Observable<any[]> {
    return this.networkOperatorRepository.getDropdownItems().pipe(
      catchError(error => {
        console.error('Error getting dropdown items:', error);
        return throwError(() => error);
      })
    );
  }
}