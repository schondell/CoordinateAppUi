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

  center: google.maps.LatLngLiteral;
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
    if (data && data.vehicleSummary) {  // Check if data and vehicleSummary are not null or undefined
      // Check if the deviceTimestamp is a new day in the user's timezone
      const newTimestamp = new Date(data.vehicleSummary.deviceTimestamp);
      const lastVertex = this.vertices.length > 0 ? this.vertices[this.vertices.length - 1] : null;
      let shouldReset = false;
      if (lastVertex && this.vehicle && this.vehicle.deviceTimestamp) {
        const lastTimestamp = new Date(this.vehicle.deviceTimestamp);
        // Compare the local date parts (year, month, day)
        if (
          newTimestamp.getFullYear() !== lastTimestamp.getFullYear() ||
          newTimestamp.getMonth() !== lastTimestamp.getMonth() ||
          newTimestamp.getDate() !== lastTimestamp.getDate()
        ) {
          shouldReset = true;
        }
      }
      if (shouldReset) {
        // Clear all markers and vertices
        this.vertices = [];
        this.markerOptions = {};
      }
      console.log(`Vehicle Make is: ${data.vehicleSummary.make}`);
      console.log(`Vehicle Model is: ${data.vehicleSummary.model}`);
      console.log(`Vehicle Year is: ${data.vehicleSummary.modelYear}`);

      this.name = data.vehicleSummary.name;
      this.speed = formatNumber(data.vehicleSummary.speed, this.currentLocale, "1.0-0");
      this.distance = formatNumber(this.toKilometers(data.vehicleSummary.currentTripMileage), this.currentLocale, "1.0-0");
      this.timeStamp = formatDate(data.vehicleSummary.deviceTimestamp, "HH:MM", this.currentLocale, this.userTimezone);

      // update the markerOptions position
      this.markerOptions = {
        ...this.markerOptions, // spread to preserve other properties
        position: {
          lat: data.vehicleSummary.latitude,
          lng: data.vehicleSummary.longitude
        },
        title: data.vehicleSummary.name,
      };

      // Update the center
      this.center = {
        lat: data.vehicleSummary.latitude,
        lng: data.vehicleSummary.longitude,
      };

      // Add the new position to vertices array for polyline
      const newVertex = {
        lat: data.vehicleSummary.latitude,
        lng: data.vehicleSummary.longitude
      };
      this.vertices = [...this.vertices, newVertex];

      this.status = "Idling";
      if (data.vehicleSummary.speed > 1)
      {
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

      this.updateVehicleCard({vehicleId: this.vehicleId, vehicleSummary: summaryInfo});
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
