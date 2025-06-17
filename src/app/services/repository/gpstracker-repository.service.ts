import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GpsTracker, GpsTrackerCreateRequest, GpsTrackerUpdateRequest, GpsTrackerSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/gpstracker.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class GpsTrackerRepositoryService extends EndpointBase {
  private readonly gpsTrackerUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.gpsTrackerUrl = configurations.baseUrl + '/api/GpsTracker/';
  }

  /**
   * Get all GPS trackers for the current tenant
   */
  getAllGpsTrackers(): Observable<GpsTracker[]> {
    const endpointUrl = `${this.gpsTrackerUrl}`;
    return this.http.get<GpsTracker[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllGpsTrackers());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getGpsTrackersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<GpsTracker>> {
    const endpointUrl = `${this.gpsTrackerUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<GpsTracker>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getGpsTrackersForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchGpsTrackers(
    search?: string,
    name?: string,
    trackerIdentification?: string,
    imeNumber?: string,
    trackerPassword?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<GpsTrackerSearchResponse> {
    const endpointUrl = `${this.gpsTrackerUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (trackerIdentification) params.trackerIdentification = trackerIdentification;
    if (imeNumber) params.imeNumber = imeNumber;
    if (trackerPassword) params.trackerPassword = trackerPassword;

    return this.http.get<GpsTrackerSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchGpsTrackers(search, name, trackerIdentification, imeNumber, trackerPassword, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single GPS tracker by ID
   */
  getGpsTrackerById(id: number): Observable<GpsTracker> {
    const endpointUrl = `${this.gpsTrackerUrl}${id}`;
    return this.http.get<GpsTracker>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getGpsTrackerById(id));
      })
    );
  }

  /**
   * Get GPS tracker by tracker identification
   */
  getGpsTrackerByTrackerIdentification(trackerIdentification: string): Observable<GpsTracker> {
    const endpointUrl = `${this.gpsTrackerUrl}by-tracker-identification/${trackerIdentification}`;
    return this.http.get<GpsTracker>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getGpsTrackerByTrackerIdentification(trackerIdentification));
      })
    );
  }

  /**
   * Create a new GPS tracker
   */
  createGpsTracker(gpsTracker: GpsTrackerCreateRequest): Observable<GpsTracker> {
    const endpointUrl = `${this.gpsTrackerUrl}`;
    return this.http.post<GpsTracker>(endpointUrl, gpsTracker, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createGpsTracker(gpsTracker));
      })
    );
  }

  /**
   * Update an existing GPS tracker
   */
  updateGpsTracker(id: number, gpsTracker: GpsTrackerUpdateRequest): Observable<void> {
    const endpointUrl = `${this.gpsTrackerUrl}${id}`;
    return this.http.put<void>(endpointUrl, gpsTracker, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateGpsTracker(id, gpsTracker));
      })
    );
  }

  /**
   * Delete a GPS tracker
   */
  deleteGpsTracker(id: number): Observable<void> {
    const endpointUrl = `${this.gpsTrackerUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteGpsTracker(id));
      })
    );
  }
}