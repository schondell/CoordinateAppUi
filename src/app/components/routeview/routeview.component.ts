import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { VehicleSummaryRepositoryService } from '../../services/repository/vehicle-summary-repository.service';
import { SignalrService } from '../../signalr.service';
import { VehicleSummary } from '../../models/vehicle-summary';
import { Observable, Subscription } from 'rxjs';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card.component';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-routeview',
  templateUrl: './routeview.component.html',
  styleUrls: ['./routeview.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    GoogleMapsModule,
    VehicleCardComponent
  ]
})
export class RouteviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  
  zoom = 12;
  markers: google.maps.MarkerOptions[] = [];
  center: google.maps.LatLngLiteral = { lat: 55.6761, lng: 12.5683 }; // Default to Copenhagen
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 21,
    minZoom: 5,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  private vehicleComponentsSubscription: Subscription;
  private signalRSubscription: Subscription;

  vehicleComponents$: Observable<VehicleSummary[]>;

  // Instead of a Map, use an array of arrays for vehicle paths
  verticesArray: google.maps.LatLngLiteral[][] = [];
  
  // Track vehicle paths that have at least 2 points for polyline rendering
  vehiclePaths: google.maps.LatLngLiteral[][] = [];

  vehicleMarkers: Map<number, google.maps.MarkerOptions> = new Map();
  vehicleLastTimestamps: Map<number, string> = new Map();

  constructor(
      private signalRService: SignalrService,
      private vehicleSummaryRepositoryService: VehicleSummaryRepositoryService,
      private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.vehicleComponents$ = this.vehicleSummaryRepositoryService.getAllVehicleSummaries().pipe(
        shareReplay(1)
    );

    this.vehicleComponentsSubscription = this.vehicleComponents$.subscribe({
      next: vehicleSummaries => {
        // Initialize an empty array for each vehicle
        this.verticesArray = vehicleSummaries.map(() => []);
        this.vehiclePaths = []; // Reset vehicle paths
        this.vehicleIdList = vehicleSummaries.map(v => v.vehicleId); // Ensure mapping is set
        vehicleSummaries.forEach((summary, idx) => {
          const marker: google.maps.MarkerOptions = {
            position: {
              lat: summary.latitude,
              lng: summary.longitude
            },
            title: summary.name
          };
          this.markers.push(marker);
          
          // Initialize path from backend polyline if available
          if (summary.polyLineRoute && summary.polyLineRoute.trim() !== '') {
            try {
              const decodedPath = google.maps.geometry.encoding.decodePath(summary.polyLineRoute);
              this.verticesArray[idx] = decodedPath.map(point => ({
                lat: point.lat(),
                lng: point.lng()
              }));
              console.log(`Initialized ${decodedPath.length} points from backend polyline for vehicle ${summary.name}`);
            } catch (error) {
              console.error(`Error decoding backend polyline for vehicle ${summary.name}:`, error);
              // Fallback to current position
              if (summary.latitude && summary.longitude) {
                this.verticesArray[idx].push({
                  lat: summary.latitude,
                  lng: summary.longitude
                });
              }
            }
          } else {
            // Initialize with the current position as first point in path
            if (summary.latitude && summary.longitude) {
              this.verticesArray[idx].push({
                lat: summary.latitude,
                lng: summary.longitude
              });
            }
          }
        });
        
        // Update vehicle paths for polyline rendering
        this.updateVehiclePaths();
        
        // Center map to show all polylines
        this.fitMapToAllPolylines();
        
      },
      error: err => {
        console.error('Error while getting vehicle summaries:', err);
      },
      complete: () => {
        console.log('Vehicle summaries processing completed!');
      }
    });
  }

  ngAfterViewInit(): void {
    this.signalRSubscription = this.signalRService.onDataReceived.subscribe(
        (data: { vehicleId: number; vehicleSummary: VehicleSummary }) => {
          this.updateVehiclePath(data);
        }
    );
  }

  // New method for updating the path for a vehicle by index
  private updateVehiclePath(data: { vehicleId: number; vehicleSummary: VehicleSummary }) {
    const vehicleIndex = this.getVehicleIndexById(data.vehicleId);
    if (vehicleIndex === -1) {
      console.warn('Vehicle index not found for vehicleId', data.vehicleId, this.vehicleIdList);
      return;
    }
    const summary = data.vehicleSummary;
    
    // Create new position object
    const newPosition = { lat: summary.latitude, lng: summary.longitude };
    
    // Create a new array for this vehicle's path to ensure reference change
    const currentPath = [...this.verticesArray[vehicleIndex]];
    currentPath.push(newPosition);
    
    // Update the vertices array with a completely new array structure
    const newVerticesArray = [...this.verticesArray];
    newVerticesArray[vehicleIndex] = currentPath;
    this.verticesArray = newVerticesArray;
    
    // Update the vehicle paths for polyline rendering (only paths with 2+ points)
    this.updateVehiclePaths();
    
    // Update marker for this vehicle
    const newMarkers = [...this.markers];
    newMarkers[vehicleIndex] = {
      position: newPosition,
      title: summary.name
    };
    this.markers = newMarkers;
    
    // Minimal change detection
    this.cd.markForCheck();
  }
  
  // Update the vehicle paths array for polyline rendering
  private updateVehiclePaths() {
    // Only update if there are meaningful changes
    const newPaths = this.verticesArray.filter(path => path.length >= 2);
    if (newPaths.length !== this.vehiclePaths.length || 
        newPaths.some((path, index) => path.length !== this.vehiclePaths[index]?.length)) {
      this.vehiclePaths = newPaths.map(path => [...path]);
    }
  }

  // Helper to get the index of a vehicle by its ID
  private getVehicleIndexById(vehicleId: number): number {
    // Use the cached vehicleIdList directly
    return this.vehicleIdList.indexOf(vehicleId);
  }
  public vehicleIdList: number[] = [];

  get vehicleMarkersArray(): google.maps.MarkerOptions[] {
    // Fallback: If vehicleMarkers is empty, use initial markers
    if (this.vehicleMarkers.size > 0) {
      return Array.from(this.vehicleMarkers.values());
    }
    return this.markers;
  }

  // Method to get different colors for different vehicles
  getVehicleColor(index: number): string {
    const colors = [
      '#4285F4', // Blue
      '#EA4335', // Red  
      '#FBBC04', // Yellow
      '#34A853', // Green
      '#FF6D01', // Orange
      '#9C27B0', // Purple
      '#00BCD4', // Cyan
      '#795548'  // Brown
    ];
    return colors[index % colors.length];
  }

  // Method to get polyline options for a vehicle
  getPolylineOptions(index: number): google.maps.PolylineOptions {
    return {
      strokeColor: this.getVehicleColor(index),
      strokeOpacity: 1.0,
      strokeWeight: 4
    };
  }

  // Method to fit map bounds to show all polylines
  private fitMapToAllPolylines(): void {
    // Wait a bit for the map to be fully initialized
    setTimeout(() => {
      if (!this.googleMap || !this.googleMap.googleMap) {
        console.log('Google map not ready yet, retrying...');
        setTimeout(() => this.fitMapToAllPolylines(), 1000);
        return;
      }

      if (this.vehiclePaths.length === 0) {
        console.log('No vehicle paths to fit bounds to');
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      let hasPoints = false;

      // Add all points from all vehicle paths to bounds
      this.vehiclePaths.forEach((path, index) => {
        if (path && path.length > 0) {
          path.forEach(point => {
            bounds.extend(point);
            hasPoints = true;
          });
          console.log(`Added ${path.length} points from vehicle ${index} to bounds`);
        }
      });

      if (hasPoints) {
        try {
          this.googleMap.googleMap.fitBounds(bounds);
          console.log('Map bounds fitted to show all polylines');
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      } else {
        console.log('No points found to fit bounds to');
      }
    }, 2000); // Wait 2 seconds for map to be ready
  }


  ngOnDestroy() {
    if (this.vehicleComponentsSubscription) {
      this.vehicleComponentsSubscription.unsubscribe();
    }
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }
  }
}
