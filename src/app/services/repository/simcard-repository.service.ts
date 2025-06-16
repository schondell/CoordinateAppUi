import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimCard, SimCardCreateRequest, SimCardUpdateRequest, SimCardSearchResponse, DataManagerRequest, DataManagerResponse } from '../../models/simcard.model';
import { ConfigurationService } from '../configuration.service';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class SimCardRepositoryService extends EndpointBase {
  private readonly simCardUrl: string;

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.simCardUrl = configurations.baseUrl + '/api/SimCard/';
  }

  /**
   * Get all sim cards for the current tenant
   */
  getAllSimCards(): Observable<SimCard[]> {
    const endpointUrl = `${this.simCardUrl}`;
    return this.http.get<SimCard[]>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllSimCards());
      })
    );
  }

  /**
   * Syncfusion DataGrid compatible endpoint for server-side operations
   */
  getSimCardsForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<SimCard>> {
    const endpointUrl = `${this.simCardUrl}UrlDatasource`;
    return this.http.post<DataManagerResponse<SimCard>>(endpointUrl, request, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSimCardsForDataGrid(request));
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchSimCards(
    search?: string,
    name?: string,
    iccid?: string,
    imsi?: string,
    mobileNumber?: string,
    description?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<SimCardSearchResponse> {
    const endpointUrl = `${this.simCardUrl}search`;
    const params: any = {
      sortBy,
      sortDirection,
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (search) params.search = search;
    if (name) params.name = name;
    if (iccid) params.iccid = iccid;
    if (imsi) params.imsi = imsi;
    if (mobileNumber) params.mobileNumber = mobileNumber;
    if (description) params.description = description;

    return this.http.get<SimCardSearchResponse>(endpointUrl, {
      ...this.getRequestHeaders(),
      params
    }).pipe(
      catchError(error => {
        return this.handleError(error, () => this.searchSimCards(search, name, iccid, imsi, mobileNumber, description, sortBy, sortDirection, page, pageSize));
      })
    );
  }

  /**
   * Get a single sim card by ID
   */
  getSimCardById(id: number): Observable<SimCard> {
    const endpointUrl = `${this.simCardUrl}${id}`;
    return this.http.get<SimCard>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSimCardById(id));
      })
    );
  }

  /**
   * Get sim card by ICCID
   */
  getSimCardByIccid(iccid: string): Observable<SimCard> {
    const endpointUrl = `${this.simCardUrl}by-iccid/${iccid}`;
    return this.http.get<SimCard>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSimCardByIccid(iccid));
      })
    );
  }

  /**
   * Create a new sim card
   */
  createSimCard(simCard: SimCardCreateRequest): Observable<SimCard> {
    const endpointUrl = `${this.simCardUrl}`;
    return this.http.post<SimCard>(endpointUrl, simCard, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createSimCard(simCard));
      })
    );
  }

  /**
   * Update an existing sim card
   */
  updateSimCard(id: number, simCard: SimCardUpdateRequest): Observable<void> {
    const endpointUrl = `${this.simCardUrl}${id}`;
    return this.http.put<void>(endpointUrl, simCard, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateSimCard(id, simCard));
      })
    );
  }

  /**
   * Delete a sim card
   */
  deleteSimCard(id: number): Observable<void> {
    const endpointUrl = `${this.simCardUrl}${id}`;
    return this.http.delete<void>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.deleteSimCard(id));
      })
    );
  }
}