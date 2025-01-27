import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { VehicleSummaryRepositoryService } from '../../services/repository/vehicle-summary-repository.service';
import { SignalrService } from '../../signalr.service';
import { VehicleSummary } from '../../models/vehicle-summary';
import { Observable, Subscription } from 'rxjs';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card.component';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-routeview',
  templateUrl: './routeview.component.html',
  styleUrls: ['./routeview.component.scss']
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
    const newMarker: google.maps.MarkerOptions = {
      position: {
        lat: data.vehicleSummary.latitude,
        lng: data.vehicleSummary.longitude
      },
      title: data.vehicleSummary.name
    };

    this.markers.push(newMarker);
    this.cd.detectChanges();
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