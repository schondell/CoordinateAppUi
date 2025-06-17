import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Vehicle, VehicleCreateRequest, VehicleUpdateRequest, VehicleSearchResponse, DataManagerRequest, DataManagerResponse } from '../models/vehicle.model';
import { VehicleRepositoryService } from './repository/vehicle-repository.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);
  public vehicles$ = this.vehiclesSubject.asObservable();

  private selectedVehicleSubject = new BehaviorSubject<Vehicle | null>(null);
  public selectedVehicle$ = this.selectedVehicleSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private vehicleRepository: VehicleRepositoryService) {}

  /**
   * Get all vehicles and update the local cache
   */
  loadAllVehicles(): Observable<Vehicle[]> {
    this.loadingSubject.next(true);
    
    return this.vehicleRepository.getAllVehicles().pipe(
      tap(vehicles => {
        this.vehiclesSubject.next(vehicles);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading vehicles:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get vehicles for Syncfusion DataGrid with server-side operations
   */
  getVehiclesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Vehicle>> {
    return this.vehicleRepository.getVehiclesForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting vehicles for DataGrid:', error);
        return throwError(() => error);
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
    return this.vehicleRepository.searchVehicles(
      search, name, make, model, licensePlateNumber, vin, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching vehicles:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific vehicle by ID
   */
  getVehicleById(id: number): Observable<Vehicle> {
    return this.vehicleRepository.getVehicleById(id).pipe(
      tap(vehicle => {
        this.selectedVehicleSubject.next(vehicle);
      }),
      catchError(error => {
        console.error(`Error getting vehicle ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get vehicle by registration number
   */
  getVehicleByLicensePlateNumber(licensePlateNumber: string): Observable<Vehicle> {
    return this.vehicleRepository.getVehicleByLicensePlateNumber(licensePlateNumber).pipe(
      catchError(error => {
        console.error(`Error getting vehicle by license plate ${licensePlateNumber}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new vehicle
   */
  createVehicle(vehicleRequest: VehicleCreateRequest): Observable<Vehicle> {
    this.loadingSubject.next(true);

    return this.vehicleRepository.createVehicle(vehicleRequest).pipe(
      tap(newVehicle => {
        // Add the new vehicle to the local cache
        const currentVehicles = this.vehiclesSubject.value;
        this.vehiclesSubject.next([...currentVehicles, newVehicle]);
        this.selectedVehicleSubject.next(newVehicle);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating vehicle:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing vehicle
   */
  updateVehicle(id: number, vehicleRequest: VehicleUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.vehicleRepository.updateVehicle(id, vehicleRequest).pipe(
      tap(() => {
        // Update the vehicle in the local cache
        const currentVehicles = this.vehiclesSubject.value;
        const updatedVehicles = currentVehicles.map(vehicle => 
          vehicle.id === id ? { ...vehicle, ...vehicleRequest } : vehicle
        );
        this.vehiclesSubject.next(updatedVehicles);
        
        // Update selected vehicle if it's the one being updated
        const selectedVehicle = this.selectedVehicleSubject.value;
        if (selectedVehicle && selectedVehicle.id === id) {
          this.selectedVehicleSubject.next({ ...selectedVehicle, ...vehicleRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating vehicle ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a vehicle
   */
  deleteVehicle(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.vehicleRepository.deleteVehicle(id).pipe(
      tap(() => {
        // Remove the vehicle from the local cache
        const currentVehicles = this.vehiclesSubject.value;
        const filteredVehicles = currentVehicles.filter(vehicle => vehicle.id !== id);
        this.vehiclesSubject.next(filteredVehicles);
        
        // Clear selected vehicle if it's the one being deleted
        const selectedVehicle = this.selectedVehicleSubject.value;
        if (selectedVehicle && selectedVehicle.id === id) {
          this.selectedVehicleSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting vehicle ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected vehicle
   */
  setSelectedVehicle(vehicle: Vehicle | null): void {
    this.selectedVehicleSubject.next(vehicle);
  }

  /**
   * Get the currently selected vehicle (synchronous)
   */
  getSelectedVehicle(): Vehicle | null {
    return this.selectedVehicleSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.vehiclesSubject.next([]);
    this.selectedVehicleSubject.next(null);
  }

  /**
   * Refresh vehicles data
   */
  refreshVehicles(): Observable<Vehicle[]> {
    return this.loadAllVehicles();
  }

  /**
   * Check if a vehicle exists by registration number
   */
  vehicleExistsByLicensePlateNumber(licensePlateNumber: string): boolean {
    const vehicles = this.vehiclesSubject.value;
    return vehicles.some(vehicle => 
      vehicle.licensePlateNumber?.toLowerCase() === licensePlateNumber.toLowerCase()
    );
  }

  /**
   * Get vehicles count
   */
  getVehiclesCount(): number {
    return this.vehiclesSubject.value.length;
  }

  /**
   * Filter vehicles by search term (local cache)
   */
  filterVehiclesLocal(searchTerm: string): Vehicle[] {
    if (!searchTerm.trim()) {
      return this.vehiclesSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.vehiclesSubject.value.filter(vehicle =>
      vehicle.make?.toLowerCase().includes(term) ||
      vehicle.model?.toLowerCase().includes(term) ||
      vehicle.licensePlateNumber?.toLowerCase().includes(term) ||
      vehicle.name?.toLowerCase().includes(term) ||
      vehicle.vin?.toLowerCase().includes(term) ||
      vehicle.vin?.toLowerCase().includes(term)
    );
  }
}