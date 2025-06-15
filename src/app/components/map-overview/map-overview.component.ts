import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapsFeaturesComponent } from "../maps-features/maps-features.component";
import { VehicleSummaryRepositoryService } from '../../services/repository/vehicle-summary-repository.service';
import { VehicleSummary } from '../../models/vehicle-summary';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'map-overview',
  templateUrl: './map-overview.component.html',
  standalone: true,
  imports: [
    MapsFeaturesComponent
  ],
  styleUrls: ['./map-overview.component.css']
})
export class MapOverviewComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('map1ElementRef', { static: false }) map1ElementRef!: ElementRef;
  private map1!: google.maps.Map;
  private vehicles: VehicleSummary[] = [];
  private vehiclePolylines: Map<number, google.maps.Polyline> = new Map();
  private vehicleMarkers: Map<number, google.maps.Marker> = new Map();
  private subscriptions: Subscription = new Subscription();
  private routerSubscription: Subscription;
  private hasLeftMap: boolean = false;

  constructor(
    private vehicleSummaryRepository: VehicleSummaryRepositoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllVehicles();
    this.setupRouterEventHandling();
  }

  private setupRouterEventHandling(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url && !event.url.includes('map-overview')) {
          this.hasLeftMap = true;
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url.includes('map-overview') && this.hasLeftMap) {
          this.hasLeftMap = false;
          this.refreshVehicleData();
        }
      }
    });
    this.subscriptions.add(this.routerSubscription);
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadAllVehicles(): void {
    const subscription = this.vehicleSummaryRepository.getAllVehicleSummaries().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        if (this.map1) {
          this.displayVehiclesOnMap();
        }
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
    this.subscriptions.add(subscription);
  }

  private initializeMap(): void {
    const loader = new Loader({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
      version: 'weekly'
    });

    loader.load().then(() => {
      const mapOptions: google.maps.MapOptions = {
        zoom: 13,
        center: { lat: 13.505892, lng: 100.8162 },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map1 = new google.maps.Map(this.map1ElementRef.nativeElement, mapOptions);
      
      if (this.vehicles.length > 0) {
        this.displayVehiclesOnMap();
      }
    });
  }

  private displayVehiclesOnMap(): void {
    if (!this.map1) return;

    this.vehicles.forEach(vehicle => {
      this.displayVehiclePolyline(vehicle);
      this.displayVehicleMarker(vehicle);
    });
  }

  private displayVehiclePolyline(vehicle: VehicleSummary): void {
    if (!vehicle.polyLineRoute || vehicle.polyLineRoute.trim() === '') {
      console.log(`No polyline data for vehicle ${vehicle.name} (ID: ${vehicle.vehicleId})`);
      return;
    }

    console.log(`Processing vehicle ${vehicle.name} with polyline data: ${vehicle.polyLineRoute ? 'YES' : 'NO'}`);
    console.log(`Vehicle timestamp: ${vehicle.deviceTimestamp}, Today: ${new Date().toDateString()}`);

    const existingPolyline = this.vehiclePolylines.get(vehicle.vehicleId);
    if (existingPolyline) {
      existingPolyline.setMap(null);
    }

    try {
      console.log(`Processing polyline for ${vehicle.name}`);
      console.log(`Polyline data:`, vehicle.polyLineRoute);
      
      const decodedPath = google.maps.geometry.encoding.decodePath(vehicle.polyLineRoute);
      console.log(`Successfully decoded ${decodedPath.length} points for vehicle ${vehicle.name}`);
      
      if (decodedPath.length === 0) {
        console.warn(`No points decoded from polyline for vehicle ${vehicle.name}`);
        return;
      }

      // Log first and last points to verify coordinates
      console.log(`First point:`, decodedPath[0]);
      console.log(`Last point:`, decodedPath[decodedPath.length - 1]);
      
      const polyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: this.getVehicleColor(vehicle.vehicleId),
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      polyline.setMap(this.map1);
      this.vehiclePolylines.set(vehicle.vehicleId, polyline);
      console.log(`Polyline successfully added to map for vehicle ${vehicle.name}`);
      
      // Fit map bounds to include the polyline
      if (decodedPath.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        this.map1.fitBounds(bounds);
        console.log(`Map bounds fitted for vehicle ${vehicle.name}`);
      }
    } catch (error) {
      console.error(`Error processing polyline for vehicle ${vehicle.name}:`, error);
      console.log('Polyline data that failed:', vehicle.polyLineRoute);
    }
  }

  private displayVehicleMarker(vehicle: VehicleSummary): void {
    const existingMarker = this.vehicleMarkers.get(vehicle.vehicleId);
    if (existingMarker) {
      existingMarker.setMap(null);
    }

    const marker = new google.maps.Marker({
      position: { lat: vehicle.latitude, lng: vehicle.longitude },
      map: this.map1,
      title: vehicle.name,
      icon: {
        url: 'assets/vehicle-marker.png',
        scaledSize: new google.maps.Size(32, 32)
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h3>${vehicle.name}</h3>
          <p>Speed: ${vehicle.speed} km/h</p>
          <p>Updated: ${new Date(vehicle.deviceTimestamp).toLocaleString()}</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map1, marker);
    });

    this.vehicleMarkers.set(vehicle.vehicleId, marker);
  }

  private getVehicleColor(vehicleId: number): string {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    return colors[vehicleId % colors.length];
  }

  public refreshVehicleData(): void {
    this.loadAllVehicles();
  }

  async syncBounds(): Promise<void> {
    const bounds = this.map1.getBounds();
    // Perform your sync bounds logic here
  }

  async syncMapCenter(): Promise<void> {
    const center = this.map1.getCenter();
    // Perform your sync map center logic here
  }

  async zoomIn(): Promise<void> {
    const zoom = this.map1.getZoom();
    this.map1.setZoom(zoom + 1);
  }

  async toggleMapType(): Promise<void> {
    const currentMapTypeId = this.map1.getMapTypeId();

    if (currentMapTypeId !== google.maps.MapTypeId.SATELLITE) {
      this.map1.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    } else {
      this.map1.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  }
}
