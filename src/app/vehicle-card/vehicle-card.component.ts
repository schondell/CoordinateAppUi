import { ChangeDetectorRef, Input, OnDestroy, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule, formatDate, formatNumber } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { VehicleSummary } from "../models/vehicle-summary";
import { SignalrService } from "../signalr.service";
import { AppTranslationService } from '../services/app-translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    GoogleMapsModule,
    TranslateModule
  ]
})
export class VehicleCardComponent implements OnInit, OnDestroy  {
  constructor(
    private signalRService: SignalrService,
    private readonly cd: ChangeDetectorRef,
    private translate: AppTranslationService
  ) {
    this.translate.useBrowserLanguage();
  }

  @Input() vehicle: VehicleSummary;
  @ViewChild(GoogleMap) map: GoogleMap;

  vehicleId: number;
  private signalRSubscription: Subscription;
  private currentLocale = navigator.language || navigator['userLanguage'];
  private userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  name: string;
  speed: string;
  distance: string;
  status: string;
  timeStamp: string;

  zoom = 7;  // Set the default zoom level
  mapOptions: google.maps.MapOptions = {
    zoomControl: false, // disable zoom control buttons
    streetViewControl: false, // disable street-view button
    mapTypeControl: false, // disable map-type button
    rotateControl: false, // disable rotate control button
  };

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Default center
  markerOptions: google.maps.MarkerOptions = {};
  vertices: google.maps.LatLngLiteral[]  = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#4285F4',
    strokeOpacity: 1.0,
    strokeWeight: 3
  };

  ngOnInit(): void {
    if (this.vehicle) {
      this.update(this.vehicle);
    }
  }

  private updateVehicleCard(data: { vehicleId: number; vehicleSummary: VehicleSummary }) {
    if (data && data.vehicleSummary) {
      const vehicleSummary = data.vehicleSummary;
      const deviceTimestamp = vehicleSummary.deviceTimestamp;
      const newTimestamp = deviceTimestamp ? new Date(deviceTimestamp) : null;
      const lastVertex = this.vertices.length > 0 ? this.vertices[this.vertices.length - 1] : null;
      let shouldReset = false;
      if (lastVertex && this.vehicle && this.vehicle.deviceTimestamp && newTimestamp) {
        const lastTimestamp = new Date(this.vehicle.deviceTimestamp);
        if (
          newTimestamp.getFullYear() !== lastTimestamp.getFullYear() ||
          newTimestamp.getMonth() !== lastTimestamp.getMonth() ||
          newTimestamp.getDate() !== lastTimestamp.getDate()
        ) {
          shouldReset = true;
        }
      }
      if (shouldReset) {
        this.vertices = [];
        this.markerOptions = {};
      }

      // Log updated and new properties
      console.log(`Vehicle Make is: ${vehicleSummary.make}`);
      console.log(`Vehicle Model is: ${vehicleSummary.model}`);
      console.log(`Vehicle Year is: ${vehicleSummary.modelYear}`);
      console.log(`Vehicle polyLineRoute: ${vehicleSummary.polyLineRoute}`);
      console.log(`Vehicle alarms:`, vehicleSummary.alarms);

      const lat = Number(vehicleSummary.currentLatitude);
      const lng = Number(vehicleSummary.currentLongitude);
      
      // Validate coordinates are valid numbers and within valid ranges
      const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
      const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
      
      this.name = vehicleSummary.name;
      this.speed = formatNumber(vehicleSummary.currentSpeed, this.currentLocale, "1.0-0");
      this.distance = formatNumber(this.toKilometers(vehicleSummary.currentTripMileage), this.currentLocale, "1.0-0");
      this.timeStamp = deviceTimestamp ? formatDate(deviceTimestamp, "HH:MM", this.currentLocale, this.userTimezone) : '';

      // update the markerOptions position only if coordinates are valid
      if (isValidLat && isValidLng) {
        console.log(`Vehicle ${vehicleSummary.name} coordinates: lat=${lat}, lng=${lng}`);
        this.markerOptions = {
          ...this.markerOptions,
          position: {
            lat: lat,
            lng: lng
          },
          title: vehicleSummary.name,
        };
        this.center = {
          lat: lat,
          lng: lng,
        };
      } else {
        console.warn(`Invalid coordinates for vehicle ${vehicleSummary.name}:`, 
          'lat:', lat, 'lng:', lng, 'isValidLat:', isValidLat, 'isValidLng:', isValidLng);
        // Don't update marker position with invalid coordinates
      }

      // Only add a new position if it's for today's date and coordinates are valid
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (newTimestamp >= today && newTimestamp < tomorrow && isValidLat && isValidLng) {
        const newVertex = {
          lat: lat,
          lng: lng
        };
        this.vertices = [...this.vertices, newVertex];
      }

      // If polyLineRoute is present, decode and update vertices
      if (vehicleSummary.polyLineRoute && vehicleSummary.polyLineRoute.trim() !== '') {
        try {
          const decodedPath = google.maps.geometry.encoding.decodePath(vehicleSummary.polyLineRoute);
          this.vertices = decodedPath.map(point => ({
            lat: point.lat(),
            lng: point.lng()
          }));
          console.log(`Updated vertices from polyLineRoute for vehicle ${vehicleSummary.name}`);
        } catch (error) {
          console.error(`Error decoding polyLineRoute for vehicle ${vehicleSummary.name}:`, error);
        }
      }

      // Optionally, handle alarms (e.g., display, log, or process)
      if (vehicleSummary.alarms && vehicleSummary.alarms.length > 0) {
        // Example: log the first alarm
        console.log('First alarm:', vehicleSummary.alarms[0]);
      }

      this.status = "Idling";
      const currentSpeed = vehicleSummary.currentSpeed;
      if (currentSpeed > 1) {
        this.status = "Driving";
      }
    } else {
      console.log('Error: data or vehicleSummary is null or undefined.');
    }

    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }
  }

  update(summaryInfo: VehicleSummary) {
    if (summaryInfo !== null) {
      this.vehicleId = summaryInfo.vehicleId;

      // Create or replace the subscription whenever vehicleId changes
      if (this.signalRSubscription) {
        this.signalRSubscription.unsubscribe();
      }

      this.signalRSubscription = this.signalRService.onDataReceived.pipe(
        filter((data: { vehicleId: number; vehicleSummary: VehicleSummary }) => data.vehicleId === this.vehicleId)
      )
        .subscribe((data: { vehicleId: number; vehicleSummary: VehicleSummary }) => {
          this.updateVehicleCard(data);
        });

      // Initialize polyline from backend data if available
      this.initializePolylineFromBackend(summaryInfo);
      
      this.updateVehicleCard({vehicleId: this.vehicleId, vehicleSummary: summaryInfo});
    }
  }

  private initializePolylineFromBackend(summaryInfo: VehicleSummary) {
    // Reset vertices
    this.vertices = [];
    
    if (summaryInfo.polyLineRoute && summaryInfo.polyLineRoute.trim() !== '') {
      try {
        // Decode the polyline route from backend
        const decodedPath = google.maps.geometry.encoding.decodePath(summaryInfo.polyLineRoute);
        this.vertices = decodedPath.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        console.log(`Vehicle card: Initialized ${this.vertices.length} vertices from backend polyline for vehicle ${summaryInfo.name}`);
      } catch (error) {
        console.error(`Vehicle card: Error decoding backend polyline for vehicle ${summaryInfo.name}:`, error);
        this.vertices = [];
      }
    } else {
      console.log(`Vehicle card: No polyline data available for vehicle ${summaryInfo.name}`);
    }
  }

  getFormattedTimestamp(): string {
    const timestamp = new Date(this.vehicle.deviceTimestamp);
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

    if (timestamp < oneWeekAgo) {
      return timestamp.toLocaleDateString();
    } else {
      return timestamp.toLocaleString();
    }
  }


  toKilometers(distance: number) {
    return(distance / 1000);
  }
}