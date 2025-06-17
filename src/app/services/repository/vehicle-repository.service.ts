import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehicleCreateRequest, VehicleUpdateRequest, VehicleSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/vehicle.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleRepositoryService extends EndpointBase {
  private readonly vehicleUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.vehicleUrl = configurations.baseUrl + '/api/Vehicle/';
  }

  /**
   * Get all vehicles for the current tenant
   */
  getAllVehicles(): Observable<Vehicle[]> {
    const endpointUrl = `${this.vehicleUrl}`;
    return this.http.get<Vehicle[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllVehicles());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getVehiclesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Vehicle>> {
    const endpointUrl = `${this.vehicleUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<Vehicle>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehiclesForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchVehicles(
    search?: string,
    name?: string,
    make?: string,
    model?: string,
    licensePlateNumber?: string,
    vin?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<VehicleSearchResponse> {
    const endpointUrl = `${this.vehicleUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (make) params.make = make;
    if (model) params.model = model;
    if (licensePlateNumber) params.licensePlateNumber = licensePlateNumber;
    if (vin) params.vin = vin;

    return this.http.get<VehicleSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchVehicles(search, name, make, model, licensePlateNumber, vin, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single vehicle by ID
   */
  getVehicleById(id: number): Observable<Vehicle> {
    const endpointUrl = `${this.vehicleUrl}${id}`;
    return this.http.get<Vehicle>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleById(id));
      })
    );
  }

  /**
   * Get vehicle by license plate number
   */
  getVehicleByLicensePlateNumber(licensePlateNumber: string): Observable<Vehicle> {
    const endpointUrl = `${this.vehicleUrl}by-license-plate/${licensePlateNumber}`;
    return this.http.get<Vehicle>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleByLicensePlateNumber(licensePlateNumber));
      })
    );
  }

  /**
   * Create a new vehicle
   */
  createVehicle(vehicle: VehicleCreateRequest): Observable<Vehicle> {
    const endpointUrl = `${this.vehicleUrl}`;
    return this.http.post<Vehicle>(endpointUrl, vehicle, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createVehicle(vehicle));
      })
    );
  }

  /**
   * Update an existing vehicle
   */
  updateVehicle(id: number, vehicle: VehicleUpdateRequest): Observable<void> {
    const endpointUrl = `${this.vehicleUrl}${id}`;
    return this.http.put<void>(endpointUrl, vehicle, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateVehicle(id, vehicle));
      })
    );
  }

  /**
   * Delete a vehicle
   */
  deleteVehicle(id: number): Observable<void> {
    const endpointUrl = `${this.vehicleUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteVehicle(id));
      })
    );
  }
}