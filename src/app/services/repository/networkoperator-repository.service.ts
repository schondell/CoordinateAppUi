import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkOperator, NetworkOperatorCreateRequest, NetworkOperatorUpdateRequest, NetworkOperatorSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/networkoperator.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkOperatorRepositoryService extends EndpointBase {
  private readonly networkOperatorUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.networkOperatorUrl = configurations.baseUrl + '/api/NetworkOperator/';
  }

  /**
   * Get all network operators
   */
  getAllNetworkOperators(): Observable<NetworkOperator[]> {
    const endpointUrl = `${this.networkOperatorUrl}`;
    return this.http.get<NetworkOperator[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllNetworkOperators());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getNetworkOperatorsForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<NetworkOperator>> {
    const endpointUrl = `${this.networkOperatorUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<NetworkOperator>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getNetworkOperatorsForDataGrid(request));
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
    const endpointUrl = `${this.networkOperatorUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (contact) params.contact = contact;
    if (vatNo) params.vatNo = vatNo;
    if (apn) params.apn = apn;

    return this.http.get<NetworkOperatorSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchNetworkOperators(search, name, email, phone, contact, vatNo, apn, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single network operator by ID
   */
  getNetworkOperatorById(id: number): Observable<NetworkOperator> {
    const endpointUrl = `${this.networkOperatorUrl}${id}`;
    return this.http.get<NetworkOperator>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getNetworkOperatorById(id));
      })
    );
  }

  /**
   * Create a new network operator
   */
  createNetworkOperator(networkOperator: NetworkOperatorCreateRequest): Observable<NetworkOperator> {
    const endpointUrl = `${this.networkOperatorUrl}`;
    return this.http.post<NetworkOperator>(endpointUrl, networkOperator, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createNetworkOperator(networkOperator));
      })
    );
  }

  /**
   * Update an existing network operator
   */
  updateNetworkOperator(id: number, networkOperator: NetworkOperatorUpdateRequest): Observable<void> {
    const endpointUrl = `${this.networkOperatorUrl}${id}`;
    return this.http.put<void>(endpointUrl, networkOperator, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateNetworkOperator(id, networkOperator));
      })
    );
  }

  /**
   * Delete a network operator
   */
  deleteNetworkOperator(id: number): Observable<void> {
    const endpointUrl = `${this.networkOperatorUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteNetworkOperator(id));
      })
    );
  }

  /**
   * Get dropdown items for network operators
   */
  getDropdownItems(): Observable<any[]> {
    const endpointUrl = `${this.networkOperatorUrl}dropdown`;
    return this.http.get<any[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getDropdownItems());
      })
    );
  }
}