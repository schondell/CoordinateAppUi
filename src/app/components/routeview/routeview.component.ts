import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
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
  zoom = 12;
  markers: google.maps.MarkerOptions[] = [];
  center: google.maps.LatLngLiteral;
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
        this._vehicleIdList = vehicleSummaries.map(v => v.vehicleId); // Ensure mapping is set
        vehicleSummaries.forEach((summary, idx) => {
          const marker: google.maps.MarkerOptions = {
            position: {
              lat: summary.latitude,
              lng: summary.longitude
            },
            title: summary.name
          };
          this.markers.push(marker);
        });
      },
      error: err => {
        console.error('Error while getting vehicle summaries:', err);
      },
      complete: () => {
        console.log('Vehicle summaries processing completed!');
      }
    });

    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
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
      console.warn('Vehicle index not found for vehicleId', data.vehicleId, this._vehicleIdList);
      return;
    }
    const summary = data.vehicleSummary;
    // Add the new position to the path
    this.verticesArray[vehicleIndex].push({ lat: summary.latitude, lng: summary.longitude });
    // Update marker for this vehicle
    this.markers[vehicleIndex] = {
      position: { lat: summary.latitude, lng: summary.longitude },
      title: summary.name
    };
    // Debug: log the updated path and marker
    console.log('Updated path for vehicle', data.vehicleId, this.verticesArray[vehicleIndex]);
    console.log('Updated marker for vehicle', data.vehicleId, this.markers[vehicleIndex]);
    // Force update of the reference for Angular change detection
    this.verticesArray = [...this.verticesArray];
    this.markers = [...this.markers];
    this.cd.detectChanges();
  }

  // Helper to get the index of a vehicle by its ID
  private getVehicleIndexById(vehicleId: number): number {
    // Use the cached _vehicleIdList directly
    return this._vehicleIdList.indexOf(vehicleId);
  }
  private _vehicleIdList: number[] = [];

  get verticesArrayFiltered(): google.maps.LatLngLiteral[][] {
    // Only return paths with at least 2 points
    const filtered = this.verticesArray.filter(path => path.length > 1);
    console.log('verticesArrayFiltered:', filtered.map((p, i) => ({ index: i, length: p.length, path: p })));
    return filtered;
  }

  get vehicleMarkersArray(): google.maps.MarkerOptions[] {
    // Fallback: If vehicleMarkers is empty, use initial markers
    if (this.vehicleMarkers.size > 0) {
      return Array.from(this.vehicleMarkers.values());
    }
    return this.markers;
  }

  // Fix: Provide the correct property for the template
  get vehiclePathsArray(): google.maps.LatLngLiteral[][] {
    return this.verticesArrayFiltered;
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
