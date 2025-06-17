import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Resource, ResourceCreateRequest, ResourceUpdateRequest, ResourceSearchResponse } from '../models/resource.model';
import { DataManagerRequest, DataManagerResponse } from '../models/vehicle.model';
import { ResourceRepositoryService } from './repository/resource-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  public resources$ = this.resourcesSubject.asObservable();

  private selectedResourceSubject = new BehaviorSubject<Resource | null>(null);
  public selectedResource$ = this.selectedResourceSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private resourceRepository: ResourceRepositoryService) {}

  /**
   * Get all resources and update the local cache
   */
  loadAllResources(): Observable<Resource[]> {
    this.loadingSubject.next(true);
    
    return this.resourceRepository.getAllResources().pipe(
      tap(resources => {
        this.resourcesSubject.next(resources);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error loading resources:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get resources for Syncfusion DataGrid with server-side operations
   */
  getResourcesForDataGrid(request: DataManagerRequest): Observable<DataManagerResponse<Resource>> {
    return this.resourceRepository.getResourcesForDataGrid(request).pipe(
      catchError(error => {
        console.error('Error getting resources for DataGrid:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  searchResources(
    search?: string,
    name?: string,
    resourceType?: string,
    category?: string,
    status?: string,
    location?: string,
    sortBy: string = 'name',
    sortDirection: string = 'asc',
    page: number = 1,
    pageSize: number = 20
  ): Observable<ResourceSearchResponse> {
    return this.resourceRepository.searchResources(
      search, name, resourceType, category, status, location, sortBy, sortDirection, page, pageSize
    ).pipe(
      catchError(error => {
        console.error('Error searching resources:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific resource by ID
   */
  getResourceById(id: number): Observable<Resource> {
    return this.resourceRepository.getResourceById(id).pipe(
      tap(resource => {
        this.selectedResourceSubject.next(resource);
      }),
      catchError(error => {
        console.error(`Error getting resource ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new resource
   */
  createResource(resourceRequest: ResourceCreateRequest): Observable<Resource> {
    this.loadingSubject.next(true);

    return this.resourceRepository.createResource(resourceRequest).pipe(
      tap(newResource => {
        // Add the new resource to the local cache
        const currentResources = this.resourcesSubject.value;
        this.resourcesSubject.next([...currentResources, newResource]);
        this.selectedResourceSubject.next(newResource);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating resource:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing resource
   */
  updateResource(id: number, resourceRequest: ResourceUpdateRequest): Observable<void> {
    this.loadingSubject.next(true);

    return this.resourceRepository.updateResource(id, resourceRequest).pipe(
      tap(() => {
        // Update the resource in the local cache
        const currentResources = this.resourcesSubject.value;
        const updatedResources = currentResources.map(resource => 
          resource.id === id ? { ...resource, ...resourceRequest } : resource
        );
        this.resourcesSubject.next(updatedResources);
        
        // Update selected resource if it's the one being updated
        const selectedResource = this.selectedResourceSubject.value;
        if (selectedResource && selectedResource.id === id) {
          this.selectedResourceSubject.next({ ...selectedResource, ...resourceRequest });
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error updating resource ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a resource
   */
  deleteResource(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.resourceRepository.deleteResource(id).pipe(
      tap(() => {
        // Remove the resource from the local cache
        const currentResources = this.resourcesSubject.value;
        const filteredResources = currentResources.filter(resource => resource.id !== id);
        this.resourcesSubject.next(filteredResources);
        
        // Clear selected resource if it's the one being deleted
        const selectedResource = this.selectedResourceSubject.value;
        if (selectedResource && selectedResource.id === id) {
          this.selectedResourceSubject.next(null);
        }
        
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error(`Error deleting resource ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set the currently selected resource
   */
  setSelectedResource(resource: Resource | null): void {
    this.selectedResourceSubject.next(resource);
  }

  /**
   * Get the currently selected resource (synchronous)
   */
  getSelectedResource(): Resource | null {
    return this.selectedResourceSubject.value;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.resourcesSubject.next([]);
    this.selectedResourceSubject.next(null);
  }

  /**
   * Refresh resources data
   */
  refreshResources(): Observable<Resource[]> {
    return this.loadAllResources();
  }

  /**
   * Check if a resource exists by name
   */
  resourceExistsByName(name: string): boolean {
    const resources = this.resourcesSubject.value;
    return resources.some(resource => 
      resource.name?.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Get resources count
   */
  getResourcesCount(): number {
    return this.resourcesSubject.value.length;
  }

  /**
   * Filter resources by search term (local cache)
   */
  filterResourcesLocal(searchTerm: string): Resource[] {
    if (!searchTerm.trim()) {
      return this.resourcesSubject.value;
    }

    const term = searchTerm.toLowerCase();
    return this.resourcesSubject.value.filter(resource =>
      resource.name?.toLowerCase().includes(term) ||
      resource.description?.toLowerCase().includes(term) ||
      resource.resourceType?.toLowerCase().includes(term) ||
      resource.category?.toLowerCase().includes(term) ||
      resource.location?.toLowerCase().includes(term) ||
      resource.serialNumber?.toLowerCase().includes(term) ||
      resource.barcode?.toLowerCase().includes(term) ||
      resource.manufacturer?.toLowerCase().includes(term) ||
      resource.model?.toLowerCase().includes(term) ||
      resource.status?.toLowerCase().includes(term)
    );
  }

  /**
   * Get resource display name for reference
   */
  getResourceDisplayName(resource: Resource): string {
    if (resource.name) {
      return resource.name;
    }
    
    const parts = [
      resource.manufacturer,
      resource.model,
      resource.serialNumber
    ].filter(part => part);
    
    return parts.join(' - ') || `Resource ${resource.id}`;
  }

  /**
   * Format resource summary for display
   */
  formatResourceSummary(resource: Resource): string {
    const parts = [
      resource.name,
      resource.resourceType,
      resource.category,
      resource.location
    ].filter(part => part && part.trim());
    
    return parts.join(' | ');
  }

  /**
   * Get resource availability status
   */
  getAvailabilityStatus(resource: Resource): string {
    if (!resource.isActive) {
      return 'Inactive';
    }
    
    if (resource.status?.toLowerCase() === 'available') {
      const available = (resource.quantityAvailable || 0) - (resource.quantityReserved || 0);
      if (available <= 0) {
        return 'Out of Stock';
      } else if (available <= (resource.minimumStock || 0)) {
        return 'Low Stock';
      } else {
        return 'Available';
      }
    }
    
    return resource.status || 'Unknown';
  }

  /**
   * Calculate available quantity
   */
  getAvailableQuantity(resource: Resource): number {
    return Math.max(0, (resource.quantityAvailable || 0) - (resource.quantityReserved || 0));
  }

  /**
   * Check if resource needs attention (low stock, expired warranty, etc.)
   */
  needsAttention(resource: Resource): boolean {
    // Check if inactive
    if (!resource.isActive) {
      return true;
    }
    
    // Check low stock
    const available = this.getAvailableQuantity(resource);
    if (available <= (resource.minimumStock || 0)) {
      return true;
    }
    
    // Check warranty expiry (within 30 days)
    if (resource.warrantyExpiry) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      if (new Date(resource.warrantyExpiry) <= thirtyDaysFromNow) {
        return true;
      }
    }
    
    return false;
  }
}