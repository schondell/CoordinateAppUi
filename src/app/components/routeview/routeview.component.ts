import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, QueryList, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

  @ViewChildren('vehicleCardRef') vehicleCards: QueryList<VehicleCardComponent>;

  vehicleComponents$: Observable<VehicleSummary[]>;

  vehiclePaths: Map<number, google.maps.LatLngLiteral[]> = new Map();
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
        vehicleSummaries.forEach(summary => {
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
          this.updateVehicleCard(data);
        }
    );
  }

  private updateVehicleCard(data: { vehicleId: number; vehicleSummary: VehicleSummary }) {
    const vehicleId = data.vehicleId;
    const summary = data.vehicleSummary;
    const newTimestamp = new Date(summary.deviceTimestamp);
    let shouldReset = false;
    const lastTimestampStr = this.vehicleLastTimestamps.get(vehicleId);
    if (lastTimestampStr) {
      const lastTimestamp = new Date(lastTimestampStr);
      if (
        newTimestamp.getFullYear() !== lastTimestamp.getFullYear() ||
        newTimestamp.getMonth() !== lastTimestamp.getMonth() ||
        newTimestamp.getDate() !== lastTimestamp.getDate()
      ) {
        shouldReset = true;
      }
    }
    if (shouldReset) {
      this.vehiclePaths.set(vehicleId, []);
    }
    // Update path
    const path = this.vehiclePaths.get(vehicleId) || [];
    path.push({ lat: summary.latitude, lng: summary.longitude });
    this.vehiclePaths.set(vehicleId, path);
    // Update marker to last position
    this.vehicleMarkers.set(vehicleId, {
      position: { lat: summary.latitude, lng: summary.longitude },
      title: summary.name
    });
    // Update last timestamp
    this.vehicleLastTimestamps.set(vehicleId, new Date(summary.deviceTimestamp).toISOString());
    this.cd.detectChanges();
  }

  get vehiclePathsArray(): google.maps.LatLngLiteral[][] {
    return Array.from(this.vehiclePaths.values());
  }

  get vehicleMarkersArray(): google.maps.MarkerOptions[] {
    return Array.from(this.vehicleMarkers.values());
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

