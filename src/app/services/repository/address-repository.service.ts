import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Address, AddressCreateRequest, AddressUpdateRequest, AddressSearchResponse } from '../../models/address.model';
import { DataManagerRequest, DataManagerResponse } from '../../models/vehicle.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AddressRepositoryService extends EndpointBase {
  private readonly addressUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService,
    router: Router
  ) {
    super(http, authService, router);
    this.addressUrl = configurations.baseUrl + '/api/Address/';
  }

  /**
   * Get all addresses for the current tenant
   */
  getAllAddresses(): Observable<Address[]> {
    const endpointUrl = `${this.addressUrl}`;
    return this.http.get<Address[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllAddresses());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getAddressesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Address>> {
    const endpointUrl = `${this.addressUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<Address>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAddressesForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchAddresses(
    search?: string,
    name?: string,
    address1?: string,
    city?: string,
    state?: string,
    country?: string,
    zip?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<AddressSearchResponse> {
    const endpointUrl = `${this.addressUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (address1) params.address1 = address1;
    if (city) params.city = city;
    if (state) params.state = state;
    if (country) params.country = country;
    if (zip) params.zip = zip;

    return this.http.get<AddressSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchAddresses(search, name, address1, city, state, country, zip, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single address by ID
   */
  getAddressById(id: number): Observable<Address> {
    const endpointUrl = `${this.addressUrl}${id}`;
    return this.http.get<Address>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAddressById(id));
      })
    );
  }

  /**
   * Create a new address
   */
  createAddress(address: AddressCreateRequest): Observable<Address> {
    const endpointUrl = `${this.addressUrl}`;
    return this.http.post<Address>(endpointUrl, address, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createAddress(address));
      })
    );
  }

  /**
   * Update an existing address
   */
  updateAddress(id: number, address: AddressUpdateRequest): Observable<void> {
    const endpointUrl = `${this.addressUrl}${id}`;
    return this.http.put<void>(endpointUrl, address, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateAddress(id, address));
      })
    );
  }

  /**
   * Delete an address
   */
  deleteAddress(id: number): Observable<void> {
    const endpointUrl = `${this.addressUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteAddress(id));
      })
    );
  }

  /**
   * Get addresses for dropdown/lookup purposes
   */
  getAddressesDropdown(): Observable<{ id: number; name: string }[]> {
    const endpointUrl = `${this.addressUrl}dropdown`;
    return this.http.get<{ id: number; name: string }[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAddressesDropdown());
      })
    );
  }
}