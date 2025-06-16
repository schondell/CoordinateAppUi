import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest, CustomerSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/customer.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerRepositoryService extends EndpointBase {
  private readonly customerUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.customerUrl = configurations.baseUrl + '/api/Customer/';
  }

  /**
   * Get all customers for the current tenant
   */
  getAllCustomers(): Observable<Customer[]> {
    const endpointUrl = `${this.customerUrl}`;
    return this.http.get<Customer[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllCustomers());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getCustomersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Customer>> {
    const endpointUrl = `${this.customerUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<Customer>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomersForDataGrid(request));
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
    const endpointUrl = `${this.customerUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (email) params.email = email;
    if (companyNo) params.companyNo = companyNo;
    if (phone) params.phone = phone;

    return this.http.get<CustomerSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchCustomers(search, email, companyNo, phone, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single customer by ID
   */
  getCustomerById(id: number): Observable<Customer> {
    const endpointUrl = `${this.customerUrl}${id}`;
    return this.http.get<Customer>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomerById(id));
      })
    );
  }

  /**
   * Get customer by company registration number
   */
  getCustomerByRegistrationNo(registrationNo: string): Observable<Customer> {
    const endpointUrl = `${this.customerUrl}by-registration/${registrationNo}`;
    return this.http.get<Customer>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCustomerByRegistrationNo(registrationNo));
      })
    );
  }

  /**
   * Create a new customer
   */
  createCustomer(customer: CustomerCreateRequest): Observable<Customer> {
    const endpointUrl = `${this.customerUrl}`;
    return this.http.post<Customer>(endpointUrl, customer, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createCustomer(customer));
      })
    );
  }

  /**
   * Update an existing customer
   */
  updateCustomer(id: number, customer: CustomerUpdateRequest): Observable<void> {
    const endpointUrl = `${this.customerUrl}${id}`;
    return this.http.put<void>(endpointUrl, customer, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateCustomer(id, customer));
      })
    );
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: number): Observable<void> {
    const endpointUrl = `${this.customerUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteCustomer(id));
      })
    );
  }
}