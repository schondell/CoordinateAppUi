import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Address, AddressCreateRequest, AddressUpdateRequest, AddressSearchResponse } from '../models/address.model';
import { DataManagerRequest, DataManagerResponse } from '../models/vehicle.model';
import { AddressRepositoryService } from './repository/address-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  public addresses$ = this.addressesSubject.asObservable();

  private selectedAddressSubject = new BehaviorSubject<Address | null>(null);
  public selectedAddress$ = this.selectedAddressSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private addressRepository: AddressRepositoryService) {}

  /**
   * Get all addresses and update the local cache
   */
  loadAllAddresses(): Observable<Address[]> {
    this.loadingSubject.next(true);
    
    return this.addressRepository.getAllAddresses().pipe(
      tap(addresses => {
        this.addressesSubject.next(addresses);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading addresses:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get addresses for Syncfusion DataGrid with server-side operations
   */
  getAddressesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Address>> {
    return this.addressRepository.getAddressesForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting addresses for DataGrid:', error);
        return throwError(() => error);
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
    return this.addressRepository.searchAddresses(
      search, name, address1, city, state, country, zip, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching addresses:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific address by ID
   */
  getAddressById(id: number): Observable<Address> {
    return this.addressRepository.getAddressById(id).pipe(
      tap(address => {
        this.selectedAddressSubject.next(address);
      }),
      catchError(error => {
        console.error(`Error getting address ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new address
   */
  createAddress(addressRequest: AddressCreateRequest): Observable<Address> {
    this.loadingSubject.next(true);

    return this.addressRepository.createAddress(addressRequest).pipe(
      tap(newAddress => {
        // Add the new address to the local cache
        const currentAddresses = this.addressesSubject.value;
        this.addressesSubject.next([...currentAddresses, newAddress]);
        this.selectedAddressSubject.next(newAddress);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing address
   */
  updateAddress(id: number, addressRequest: AddressUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.addressRepository.updateAddress(id, addressRequest).pipe(
      tap(() => {
        // Update the address in the local cache
        const currentAddresses = this.addressesSubject.value;
        const updatedAddresses = currentAddresses.map(address => 
          address.id === id ? { ...address, ...addressRequest } : address
        );
        this.addressesSubject.next(updatedAddresses);
        
        // Update selected address if it's the one being updated
        const selectedAddress = this.selectedAddressSubject.value;
        if (selectedAddress && selectedAddress.id === id) {
          this.selectedAddressSubject.next({ ...selectedAddress, ...addressRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating address ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an address
   */
  deleteAddress(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.addressRepository.deleteAddress(id).pipe(
      tap(() => {
        // Remove the address from the local cache
        const currentAddresses = this.addressesSubject.value;
        const filteredAddresses = currentAddresses.filter(address => address.id !== id);
        this.addressesSubject.next(filteredAddresses);
        
        // Clear selected address if it's the one being deleted
        const selectedAddress = this.selectedAddressSubject.value;
        if (selectedAddress && selectedAddress.id === id) {
          this.selectedAddressSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting address ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected address
   */
  setSelectedAddress(address: Address | null): void {
    this.selectedAddressSubject.next(address);
  }

  /**
   * Get the currently selected address (synchronous)
   */
  getSelectedAddress(): Address | null {
    return this.selectedAddressSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.addressesSubject.next([]);
    this.selectedAddressSubject.next(null);
  }

  /**
   * Refresh addresses data
   */
  refreshAddresses(): Observable<Address[]> {
    return this.loadAllAddresses();
  }

  /**
   * Check if an address exists by name
   */
  addressExistsByName(name: string): boolean {
    const addresses = this.addressesSubject.value;
    return addresses.some(address => 
      address.name?.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Get addresses count
   */
  getAddressesCount(): number {
    return this.addressesSubject.value.length;
  }

  /**
   * Filter addresses by search term (local cache)
   */
  filterAddressesLocal(searchTerm: string): Address[] {
    if (!searchTerm.trim()) {
      return this.addressesSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.addressesSubject.value.filter(address =>
      address.name?.toLowerCase().includes(term) ||
      address.address1?.toLowerCase().includes(term) ||
      address.address2?.toLowerCase().includes(term) ||
      address.city?.toLowerCase().includes(term) ||
      address.state?.toLowerCase().includes(term) ||
      address.country?.toLowerCase().includes(term) ||
      address.zip?.toLowerCase().includes(term)
    );
  }

  /**
   * Get address display name for reference
   */
  getAddressDisplayName(address: Address): string {
    if (address.name) {
      return address.name;
    }
    
    const parts = [
      address.address1,
      address.city,
      address.state,
      address.zip
    ].filter(part => part);
    
    return parts.join(', ') || `Address ${address.id}`;
  }

  /**
   * Format full address for display
   */
  formatFullAddress(address: Address): string {
    const parts = [
      address.address1,
      address.address2,
      address.address3,
      address.city,
      address.state,
      address.zip,
      address.country
    ].filter(part => part && part.trim());
    
    return parts.join(', ');
  }
}