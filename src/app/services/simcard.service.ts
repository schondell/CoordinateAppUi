import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SimCard, SimCardCreateRequest, SimCardUpdateRequest, SimCardSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/simcard.model';
import { SimCardRepositoryService } from './repository/simcard-repository.service';

@Injectable({
  providedIn: 'root'
})
export class SimCardService {
  private simCardsSubject = new BehaviorSubject<SimCard[]>([]);
  public simCards$ = this.simCardsSubject.asObservable();

  private selectedSimCardSubject = new BehaviorSubject<SimCard | null>(null);
  public selectedSimCard$ = this.selectedSimCardSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private simCardRepository: SimCardRepositoryService) {}

  /**
   * Get all sim cards and update the local cache
   */
  loadAllSimCards(): Observable<SimCard[]> {
    this.loadingSubject.next(true);
    
    return this.simCardRepository.getAllSimCards().pipe(
      tap(simCards => {
        this.simCardsSubject.next(simCards);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading sim cards:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get sim cards for Syncfusion DataGrid with server-side operations
   */
  getSimCardsForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<SimCard>> {
    return this.simCardRepository.getSimCardsForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting sim cards for DataGrid:', error);
        return throwError(() => error);
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
    return this.simCardRepository.searchSimCards(
      search, name, iccid, imsi, mobileNumber, description, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching sim cards:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific sim card by ID
   */
  getSimCardById(id: number): Observable<SimCard> {
    return this.simCardRepository.getSimCardById(id).pipe(
      tap(simCard => {
        this.selectedSimCardSubject.next(simCard);
      }),
      catchError(error => {
        console.error(`Error getting sim card ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get sim card by ICCID
   */
  getSimCardByIccid(iccid: string): Observable<SimCard> {
    return this.simCardRepository.getSimCardByIccid(iccid).pipe(
      catchError(error => {
        console.error(`Error getting sim card by ICCID ${iccid}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new sim card
   */
  createSimCard(simCardRequest: SimCardCreateRequest): Observable<SimCard> {
    this.loadingSubject.next(true);

    return this.simCardRepository.createSimCard(simCardRequest).pipe(
      tap(newSimCard => {
        // Add the new sim card to the local cache
        const currentSimCards = this.simCardsSubject.value;
        this.simCardsSubject.next([...currentSimCards, newSimCard]);
        this.selectedSimCardSubject.next(newSimCard);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating sim card:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing sim card
   */
  updateSimCard(id: number, simCardRequest: SimCardUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.simCardRepository.updateSimCard(id, simCardRequest).pipe(
      tap(() => {
        // Update the sim card in the local cache
        const currentSimCards = this.simCardsSubject.value;
        const updatedSimCards = currentSimCards.map(simCard => 
          simCard.id === id ? { ...simCard, ...simCardRequest } : simCard
        );
        this.simCardsSubject.next(updatedSimCards);
        
        // Update selected sim card if it's the one being updated
        const selectedSimCard = this.selectedSimCardSubject.value;
        if (selectedSimCard && selectedSimCard.id === id) {
          this.selectedSimCardSubject.next({ ...selectedSimCard, ...simCardRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating sim card ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a sim card
   */
  deleteSimCard(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.simCardRepository.deleteSimCard(id).pipe(
      tap(() => {
        // Remove the sim card from the local cache
        const currentSimCards = this.simCardsSubject.value;
        const filteredSimCards = currentSimCards.filter(simCard => simCard.id !== id);
        this.simCardsSubject.next(filteredSimCards);
        
        // Clear selected sim card if it's the one being deleted
        const selectedSimCard = this.selectedSimCardSubject.value;
        if (selectedSimCard && selectedSimCard.id === id) {
          this.selectedSimCardSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting sim card ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected sim card
   */
  setSelectedSimCard(simCard: SimCard | null): void {
    this.selectedSimCardSubject.next(simCard);
  }

  /**
   * Get the currently selected sim card (synchronous)
   */
  getSelectedSimCard(): SimCard | null {
    return this.selectedSimCardSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.simCardsSubject.next([]);
    this.selectedSimCardSubject.next(null);
  }

  /**
   * Refresh sim cards data
   */
  refreshSimCards(): Observable<SimCard[]> {
    return this.loadAllSimCards();
  }

  /**
   * Check if a sim card exists by ICCID
   */
  simCardExistsByIccid(iccid: string): boolean {
    const simCards = this.simCardsSubject.value;
    return simCards.some(simCard => 
      simCard.iccid?.toLowerCase() === iccid.toLowerCase()
    );
  }

  /**
   * Get sim cards count
   */
  getSimCardsCount(): number {
    return this.simCardsSubject.value.length;
  }

  /**
   * Filter sim cards by search term (local cache)
   */
  filterSimCardsLocal(searchTerm: string): SimCard[] {
    if (!searchTerm.trim()) {
      return this.simCardsSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.simCardsSubject.value.filter(simCard =>
      simCard.iccid?.toLowerCase().includes(term) ||
      simCard.mobileNumber?.toLowerCase().includes(term) ||
      simCard.description?.toLowerCase().includes(term) ||
      simCard.name?.toLowerCase().includes(term) ||
      simCard.imsi?.toLowerCase().includes(term)
    );
  }
}