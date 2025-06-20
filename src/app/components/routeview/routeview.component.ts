import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { VehicleSummaryRepositoryService } from '../../services/repository/vehicle-summary-repository.service';
import { SignalrService } from '../../signalr.service';
import { VehicleSummary } from '../../models/vehicle-summary';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
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
  private vehicleSubject = new BehaviorSubject<VehicleSummary[]>([]);

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
    // Set up the observable to use our BehaviorSubject
    this.vehicleComponents$ = this.vehicleSubject.asObservable();

    // Load initial vehicles from repository
    this.vehicleSummaryRepositoryService.getAllVehicleSummaries().subscribe({
      next: initialVehicles => {
        this.vehicleSubject.next(initialVehicles);
      },
      error: err => {
        console.error('Error loading initial vehicles:', err);
      }
    });

    this.vehicleComponentsSubscription = this.vehicleComponents$.subscribe({
      next: vehicleSummaries => {
        // Initialize an empty array for each vehicle
        this.verticesArray = vehicleSummaries.map(() => []);
        this.vehiclePaths = []; // Reset vehicle paths
        this.markers = []; // Reset markers array
        this.vehicleIdList = vehicleSummaries.map(v => v.vehicleId); // Ensure mapping is set
        console.log(`Processing ${vehicleSummaries.length} vehicles:`, vehicleSummaries.map(v => `${v.name} (ID: ${v.vehicleId})`));
        
        // Check device identities to verify they're different
        console.log('Device identities:');
        vehicleSummaries.forEach((v, i) => {
          console.log(`  Vehicle ${v.name} (ID: ${v.vehicleId}): deviceIdentity = "${v.deviceIdentity}"`);
        });
        
        // Check if polyLineRoute data is different between vehicles
        const polylineRoutes = vehicleSummaries.map(v => v.polyLineRoute);
        const uniqueRoutes = [...new Set(polylineRoutes)];
        if (uniqueRoutes.length < vehicleSummaries.length) {
          console.warn(`WARNING: Found ${uniqueRoutes.length} unique polyline routes for ${vehicleSummaries.length} vehicles - this may cause cross-vehicle lines!`);
          vehicleSummaries.forEach((v, i) => {
            console.log(`  Vehicle ${v.name} (ID: ${v.vehicleId}): polyLineRoute length = ${v.polyLineRoute?.length || 0}`);
          });
        }
        
        // Check if device identities are unique
        const deviceIdentities = vehicleSummaries.map(v => v.deviceIdentity);
        const uniqueDeviceIds = [...new Set(deviceIdentities)];
        if (uniqueDeviceIds.length < vehicleSummaries.length) {
          console.error(`PROBLEM: Found ${uniqueDeviceIds.length} unique device identities for ${vehicleSummaries.length} vehicles!`);
          console.error('This means your simulators are using the same deviceId, causing them to be treated as one vehicle.');
          console.error('Device identities:', deviceIdentities);
        }
        
        vehicleSummaries.forEach((summary, idx) => {
          const lat = Number(summary.currentLatitude);
          const lng = Number(summary.currentLongitude);
          
          // Validate coordinates are valid numbers and within valid ranges
          const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
          const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
          
          if (isValidLat && isValidLng) {
            const marker: google.maps.MarkerOptions = {
              position: {
                lat: lat,
                lng: lng
              },
              title: summary.name
            };
            this.markers[idx] = marker;
          } else {
            console.warn(`Invalid coordinates for vehicle ${summary.name} in routeview:`, 
              'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
          }
          
          // Initialize path from backend polyline if available
          if (summary.polyLineRoute && summary.polyLineRoute.trim() !== '') {
            try {
              const decodedPath = google.maps.geometry.encoding.decodePath(summary.polyLineRoute);
              this.verticesArray[idx] = decodedPath.map(point => ({
                lat: point.lat(),
                lng: point.lng()
              }));
              console.log(`Vehicle ${summary.name} (ID: ${summary.vehicleId}) at index ${idx}:`);
              console.log(`  - Initialized ${decodedPath.length} points from backend polyline`);
              console.log(`  - First point: lat=${decodedPath[0]?.lat()}, lng=${decodedPath[0]?.lng()}`);
              console.log(`  - Last point: lat=${decodedPath[decodedPath.length-1]?.lat()}, lng=${decodedPath[decodedPath.length-1]?.lng()}`);
            } catch (error) {
              console.error(`Error decoding backend polyline for vehicle ${summary.name}:`, error);
              // Fallback to current position
              const lat = Number(summary.currentLatitude);
              const lng = Number(summary.currentLongitude);
              
              // Validate coordinates before using them
              const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
              const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
              
              if (isValidLat && isValidLng) {
                this.verticesArray[idx].push({
                  lat,
                  lng
                });
              } else {
                console.warn(`Invalid coordinates for vehicle ${summary.name} polyline fallback:`, 
                  'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
              }
            }
          } else {
            // Initialize with the current position as first point in path
            const lat = Number(summary.currentLatitude);
            const lng = Number(summary.currentLongitude);
            
            // Validate coordinates before using them
            const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
            const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
            
            if (isValidLat && isValidLng) {
              this.verticesArray[idx].push({
                lat,
                lng
              });
            } else {
              console.warn(`Invalid coordinates for vehicle ${summary.name} path initialization:`, 
                'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
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
          this.handleVehicleUpdate(data);
        }
    );
  }

  // New method to handle vehicle updates and detect new vehicles
  private handleVehicleUpdate(data: { vehicleId: number; vehicleSummary: VehicleSummary }) {
    const vehicleIndex = this.getVehicleIndexById(data.vehicleId);
    
    if (vehicleIndex === -1) {
      // This is a new vehicle - add it dynamically
      console.log(`New vehicle detected: ${data.vehicleSummary.name} (ID: ${data.vehicleId})`);
      this.addNewVehicleCard(data.vehicleSummary);
    } else {
      // Existing vehicle - update its path
      this.updateVehiclePath(data);
    }
  }

  // Method to dynamically add a new vehicle card
  private addNewVehicleCard(vehicleSummary: VehicleSummary) {
    const currentVehicles = this.vehicleSubject.value;
    
    // Check if vehicle already exists (double-check to prevent duplicates)
    if (currentVehicles.some(v => v.vehicleId === vehicleSummary.vehicleId)) {
      console.log(`Vehicle ${vehicleSummary.name} (ID: ${vehicleSummary.vehicleId}) already exists, skipping add`);
      return;
    }
    
    const updatedVehicles = [...currentVehicles, vehicleSummary];
    
    // Update the BehaviorSubject with the new vehicle list
    this.vehicleSubject.next(updatedVehicles);
    
    console.log(`Added new vehicle card for ${vehicleSummary.name} (ID: ${vehicleSummary.vehicleId})`);
  }

  // Initialize a new vehicle's marker and path
  private initializeNewVehicle(summary: VehicleSummary, index: number) {
    const lat = Number(summary.currentLatitude);
    const lng = Number(summary.currentLongitude);
    
    // Validate coordinates
    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
    
    if (isValidLat && isValidLng) {
      // Initialize marker
      this.markers[index] = {
        position: { lat, lng },
        title: summary.name
      };
      
      // Initialize path from backend polyline if available
      if (summary.polyLineRoute && summary.polyLineRoute.trim() !== '') {
        try {
          const decodedPath = google.maps.geometry.encoding.decodePath(summary.polyLineRoute);
          this.verticesArray[index] = decodedPath.map(point => ({
            lat: point.lat(),
            lng: point.lng()
          }));
          console.log(`Initialized ${decodedPath.length} points from polyline for new vehicle ${summary.name}`);
        } catch (error) {
          console.error(`Error decoding polyline for new vehicle ${summary.name}:`, error);
          // Fallback to current position
          this.verticesArray[index] = [{ lat, lng }];
        }
      } else {
        // Initialize with current position
        this.verticesArray[index] = [{ lat, lng }];
      }
      
      // Update vehicle paths and fit map
      this.updateVehiclePaths();
      this.fitMapToAllPolylines();
    } else {
      console.warn(`Invalid coordinates for new vehicle ${summary.name}:`, { lat, lng });
    }
  }

  // New method for updating the path for a vehicle by index
  private updateVehiclePath(data: { vehicleId: number; vehicleSummary: VehicleSummary }) {
    const vehicleIndex = this.getVehicleIndexById(data.vehicleId);
    if (vehicleIndex === -1) {
      console.warn('Vehicle index not found for vehicleId', data.vehicleId, this.vehicleIdList);
      return;
    }
    const summary = data.vehicleSummary;
    console.log(`Updating path for vehicle ${summary.name} (ID: ${data.vehicleId}) at index ${vehicleIndex}`);

    // If polyLineRoute is present and not empty, decode and use it to update the path
    if (summary.polyLineRoute && summary.polyLineRoute.trim() !== '') {
      try {
        const decodedPath = google.maps.geometry.encoding.decodePath(summary.polyLineRoute);
        this.verticesArray[vehicleIndex] = decodedPath.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        console.log(`Updated path from polyLineRoute for vehicle ${summary.name} (ID: ${summary.vehicleId}) at index ${vehicleIndex}: ${decodedPath.length} points`);
      } catch (error) {
        console.error(`Error decoding polyLineRoute for vehicle ${summary.name}:`, error);
        const lat = Number(summary.currentLatitude);
        const lng = Number(summary.currentLongitude);
        
        // Validate coordinates before using them
        const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
        const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
        
        if (isValidLat && isValidLng) {
          const newPosition = { lat, lng };
          const currentPath = [...this.verticesArray[vehicleIndex]];
          currentPath.push(newPosition);
          this.verticesArray[vehicleIndex] = currentPath;
        } else {
          console.warn(`Invalid coordinates for vehicle ${summary.name} in updateVehiclePath fallback:`, 
            'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
        }
      }
    } else {
      const lat = Number(summary.currentLatitude);
      const lng = Number(summary.currentLongitude);
      
      // Validate coordinates before using them
      const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
      const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
      
      if (isValidLat && isValidLng) {
        const newPosition = { lat, lng };
        const currentPath = [...this.verticesArray[vehicleIndex]];
        currentPath.push(newPosition);
        this.verticesArray[vehicleIndex] = currentPath;
      } else {
        console.warn(`Invalid coordinates for vehicle ${summary.name} in updateVehiclePath:`, 
          'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
      }
    }

    // Optionally, log alarms if present
    if (summary.alarms && summary.alarms.length > 0) {
      console.log(`Alarms for vehicle ${summary.name}:`, summary.alarms);
    }

    // Update the vehicle paths for polyline rendering (only paths with 2+ points)
    this.updateVehiclePaths();

    // Update marker for this vehicle
    const lat = Number(summary.currentLatitude);
    const lng = Number(summary.currentLongitude);
    
    // Validate coordinates before updating marker
    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
    
    if (isValidLat && isValidLng) {
      const newMarkers = [...this.markers];
      newMarkers[vehicleIndex] = {
        position: { lat, lng },
        title: summary.name
      };
      this.markers = newMarkers;
    } else {
      console.warn(`Invalid coordinates for vehicle ${summary.name} marker update:`, 
        'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
    }

    // Minimal change detection
    this.cd.markForCheck();
  }
  
  // Update the vehicle paths array for polyline rendering
  private updateVehiclePaths() {
    // Maintain index alignment by keeping empty arrays for vehicles with insufficient points
    const newPaths = this.verticesArray.map(path => path.length >= 2 ? [...path] : []);
    
    // Check if we need to update (compare lengths and content)
    const needsUpdate = newPaths.length !== this.vehiclePaths.length || 
        newPaths.some((path, index) => path.length !== this.vehiclePaths[index]?.length);
    
    if (needsUpdate) {
      this.vehiclePaths = newPaths;
      console.log(`Updated vehicle paths: ${this.vehiclePaths.filter(p => p.length >= 2).length} valid paths out of ${this.vehiclePaths.length} vehicles`);
      
      // Log details for each path
      this.vehiclePaths.forEach((path, index) => {
        if (path.length >= 2) {
          const vehicleName = this.vehicleIdList[index] ? `Vehicle ID ${this.vehicleIdList[index]}` : `Index ${index}`;
          console.log(`  ${vehicleName}: ${path.length} points, from (${path[0].lat.toFixed(4)}, ${path[0].lng.toFixed(4)}) to (${path[path.length-1].lat.toFixed(4)}, ${path[path.length-1].lng.toFixed(4)})`);
        }
      });
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
    if (this.vehicleSubject) {
      this.vehicleSubject.complete();
    }
  }
}
