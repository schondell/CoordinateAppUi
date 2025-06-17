import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { GpsTracker, GpsTrackerCreateRequest, GpsTrackerUpdateRequest, GpsTrackerSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/gpstracker.model';
import { GpsTrackerRepositoryService } from './repository/gpstracker-repository.service';

@Injectable({
  providedIn: 'root'
})
export class GpsTrackerService {
  private gpsTrackersSubject = new BehaviorSubject<GpsTracker[]>([]);
  public gpsTrackers$ = this.gpsTrackersSubject.asObservable();

  private selectedGpsTrackerSubject = new BehaviorSubject<GpsTracker | null>(null);
  public selectedGpsTracker$ = this.selectedGpsTrackerSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private gpsTrackerRepository: GpsTrackerRepositoryService) {}

  /**
   * Get all GPS trackers and update the local cache
   */
  loadAllGpsTrackers(): Observable<GpsTracker[]> {
    this.loadingSubject.next(true);
    
    return this.gpsTrackerRepository.getAllGpsTrackers().pipe(
      tap(gpsTrackers => {
        this.gpsTrackersSubject.next(gpsTrackers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading GPS trackers:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get GPS trackers for Syncfusion DataGrid with server-side operations
   */
  getGpsTrackersForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<GpsTracker>> {
    return this.gpsTrackerRepository.getGpsTrackersForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting GPS trackers for DataGrid:', error);
        return throwError(() => error);
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
    return this.gpsTrackerRepository.searchGpsTrackers(
      search, name, trackerIdentification, imeNumber, trackerPassword, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching GPS trackers:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific GPS tracker by ID
   */
  getGpsTrackerById(id: number): Observable<GpsTracker> {
    return this.gpsTrackerRepository.getGpsTrackerById(id).pipe(
      tap(gpsTracker => {
        this.selectedGpsTrackerSubject.next(gpsTracker);
      }),
      catchError(error => {
        console.error(`Error getting GPS tracker ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get GPS tracker by device ID
   */
  getGpsTrackerByTrackerIdentification(trackerIdentification: string): Observable<GpsTracker> {
    return this.gpsTrackerRepository.getGpsTrackerByTrackerIdentification(trackerIdentification).pipe(
      catchError(error => {
        console.error(`Error getting GPS tracker by tracker identification ${trackerIdentification}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new GPS tracker
   */
  createGpsTracker(gpsTrackerRequest: GpsTrackerCreateRequest): Observable<GpsTracker> {
    this.loadingSubject.next(true);

    return this.gpsTrackerRepository.createGpsTracker(gpsTrackerRequest).pipe(
      tap(newGpsTracker => {
        // Add the new GPS tracker to the local cache
        const currentGpsTrackers = this.gpsTrackersSubject.value;
        this.gpsTrackersSubject.next([...currentGpsTrackers, newGpsTracker]);
        this.selectedGpsTrackerSubject.next(newGpsTracker);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating GPS tracker:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing GPS tracker
   */
  updateGpsTracker(id: number, gpsTrackerRequest: GpsTrackerUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.gpsTrackerRepository.updateGpsTracker(id, gpsTrackerRequest).pipe(
      tap(() => {
        // Update the GPS tracker in the local cache
        const currentGpsTrackers = this.gpsTrackersSubject.value;
        const updatedGpsTrackers = currentGpsTrackers.map(gpsTracker => 
          gpsTracker.id === id ? { ...gpsTracker, ...gpsTrackerRequest } : gpsTracker
        );
        this.gpsTrackersSubject.next(updatedGpsTrackers);
        
        // Update selected GPS tracker if it's the one being updated
        const selectedGpsTracker = this.selectedGpsTrackerSubject.value;
        if (selectedGpsTracker && selectedGpsTracker.id === id) {
          this.selectedGpsTrackerSubject.next({ ...selectedGpsTracker, ...gpsTrackerRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating GPS tracker ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a GPS tracker
   */
  deleteGpsTracker(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.gpsTrackerRepository.deleteGpsTracker(id).pipe(
      tap(() => {
        // Remove the GPS tracker from the local cache
        const currentGpsTrackers = this.gpsTrackersSubject.value;
        const filteredGpsTrackers = currentGpsTrackers.filter(gpsTracker => gpsTracker.id !== id);
        this.gpsTrackersSubject.next(filteredGpsTrackers);
        
        // Clear selected GPS tracker if it's the one being deleted
        const selectedGpsTracker = this.selectedGpsTrackerSubject.value;
        if (selectedGpsTracker && selectedGpsTracker.id === id) {
          this.selectedGpsTrackerSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting GPS tracker ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected GPS tracker
   */
  setSelectedGpsTracker(gpsTracker: GpsTracker | null): void {
    this.selectedGpsTrackerSubject.next(gpsTracker);
  }

  /**
   * Get the currently selected GPS tracker (synchronous)
   */
  getSelectedGpsTracker(): GpsTracker | null {
    return this.selectedGpsTrackerSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.gpsTrackersSubject.next([]);
    this.selectedGpsTrackerSubject.next(null);
  }

  /**
   * Refresh GPS trackers data
   */
  refreshGpsTrackers(): Observable<GpsTracker[]> {
    return this.loadAllGpsTrackers();
  }

  /**
   * Check if a GPS tracker exists by device ID
   */
  gpsTrackerExistsByTrackerIdentification(trackerIdentification: string): boolean {
    const gpsTrackers = this.gpsTrackersSubject.value;
    return gpsTrackers.some(gpsTracker => 
      gpsTracker.trackerIdentification?.toLowerCase() === trackerIdentification.toLowerCase()
    );
  }

  /**
   * Get GPS trackers count
   */
  getGpsTrackersCount(): number {
    return this.gpsTrackersSubject.value.length;
  }

  /**
   * Filter GPS trackers by search term (local cache)
   */
  filterGpsTrackersLocal(searchTerm: string): GpsTracker[] {
    if (!searchTerm.trim()) {
      return this.gpsTrackersSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.gpsTrackersSubject.value.filter(gpsTracker =>
      gpsTracker.name?.toLowerCase().includes(term) ||
      gpsTracker.trackerIdentification?.toLowerCase().includes(term) ||
      gpsTracker.imeNumber?.toLowerCase().includes(term) ||
      gpsTracker.trackerPassword?.toLowerCase().includes(term)
    );
  }
}