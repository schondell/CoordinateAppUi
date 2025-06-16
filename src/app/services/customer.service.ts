import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest, CustomerSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/customer.model';
import { CustomerRepositoryService } from './repository/customer-repository.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);
  public selectedCustomer$ = this.selectedCustomerSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private customerRepository: CustomerRepositoryService) {}

  /**
   * Get all customers and update the local cache
   */
  loadAllCustomers(): Observable<Customer[]> {
    this.loadingSubject.next(true);
    
    return this.customerRepository.getAllCustomers().pipe(
      tap(customers => {
        this.customersSubject.next(customers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading customers:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get customers for Syncfusion DataGrid with server-side operations
   */
  getCustomersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Customer>> {
    return this.customerRepository.getCustomersForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting customers for DataGrid:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchCustomers(
    search?: string,
    email?: string,
    companyNo?: string,
    phone?: string,
    sortBy: string = 'email',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<CustomerSearchResponse> {
    return this.customerRepository.searchCustomers(
      search, email, companyNo, phone, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching customers:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific customer by ID
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.customerRepository.getCustomerById(id).pipe(
      tap(customer => {
        this.selectedCustomerSubject.next(customer);
      }),
      catchError(error => {
        console.error(`Error getting customer ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get customer by company registration number
   */
  getCustomerByRegistrationNo(registrationNo: string): Observable<Customer> {
    return this.customerRepository.getCustomerByRegistrationNo(registrationNo).pipe(
      catchError(error => {
        console.error(`Error getting customer by registration ${registrationNo}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new customer
   */
  createCustomer(customerRequest: CustomerCreateRequest): Observable<Customer> {
    this.loadingSubject.next(true);

    return this.customerRepository.createCustomer(customerRequest).pipe(
      tap(newCustomer => {
        // Add the new customer to the local cache
        const currentCustomers = this.customersSubject.value;
        this.customersSubject.next([...currentCustomers, newCustomer]);
        this.selectedCustomerSubject.next(newCustomer);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating customer:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing customer
   */
  updateCustomer(id: number, customerRequest: CustomerUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.customerRepository.updateCustomer(id, customerRequest).pipe(
      tap(() => {
        // Update the customer in the local cache
        const currentCustomers = this.customersSubject.value;
        const updatedCustomers = currentCustomers.map(customer => 
          customer.id === id ? { ...customer, ...customerRequest } : customer
        );
        this.customersSubject.next(updatedCustomers);
        
        // Update selected customer if it's the one being updated
        const selectedCustomer = this.selectedCustomerSubject.value;
        if (selectedCustomer && selectedCustomer.id === id) {
          this.selectedCustomerSubject.next({ ...selectedCustomer, ...customerRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating customer ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.customerRepository.deleteCustomer(id).pipe(
      tap(() => {
        // Remove the customer from the local cache
        const currentCustomers = this.customersSubject.value;
        const filteredCustomers = currentCustomers.filter(customer => customer.id !== id);
        this.customersSubject.next(filteredCustomers);
        
        // Clear selected customer if it's the one being deleted
        const selectedCustomer = this.selectedCustomerSubject.value;
        if (selectedCustomer && selectedCustomer.id === id) {
          this.selectedCustomerSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting customer ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected customer
   */
  setSelectedCustomer(customer: Customer | null): void {
    this.selectedCustomerSubject.next(customer);
  }

  /**
   * Get the currently selected customer (synchronous)
   */
  getSelectedCustomer(): Customer | null {
    return this.selectedCustomerSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.customersSubject.next([]);
    this.selectedCustomerSubject.next(null);
  }

  /**
   * Refresh customers data
   */
  refreshCustomers(): Observable<Customer[]> {
    return this.loadAllCustomers();
  }

  /**
   * Check if a customer exists by email
   */
  customerExistsByEmail(email: string): boolean {
    const customers = this.customersSubject.value;
    return customers.some(customer => 
      customer.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Check if a customer exists by company number
   */
  customerExistsByCompanyNo(companyNo: string): boolean {
    const customers = this.customersSubject.value;
    return customers.some(customer => 
      customer.companyNo?.toLowerCase() === companyNo.toLowerCase()
    );
  }

  /**
   * Get customers count
   */
  getCustomersCount(): number {
    return this.customersSubject.value.length;
  }

  /**
   * Filter customers by search term (local cache)
   */
  filterCustomersLocal(searchTerm: string): Customer[] {
    if (!searchTerm.trim()) {
      return this.customersSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.customersSubject.value.filter(customer =>
      customer.email.toLowerCase().includes(term) ||
      customer.contact?.toLowerCase().includes(term) ||
      customer.companyNo?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term)
    );
  }
}