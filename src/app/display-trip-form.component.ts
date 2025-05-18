import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from "@angular/google-maps";
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Subscription } from "rxjs";
import { IVehicleTripLogFullDto, VehicleTripLogFullDto } from 'src/app/models/generatedtypes';
import { IRouteResponse } from 'src/app/models/IRouteInput';
import { DisplayTripFormService } from "./display-trip-form-service";

@Component({
  selector: 'app-display-trip-form',
  templateUrl: './display-trip-form.component.html',
  styleUrls: ['./display-trip-form.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    GoogleMapsModule
  ]
})
export class DisplayTripFormComponent implements OnInit, OnDestroy, OnChanges {
  private closeSubscription: Subscription;
  @ViewChild(GoogleMap, { static: false }) routeMap: GoogleMap;
  @ViewChild('tripDialog') public tripDialog: DialogComponent;
  vehicleTripLogFullDto: VehicleTripLogFullDto;
  refRoute: IRouteResponse;
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 21,
    minZoom: 5,
  };

  polylineOptionsRed: google.maps.PolylineOptions = {
    strokeColor: 'red',
    strokeOpacity: 1,
    strokeWeight: 5
  };

  polylineOptionsBlue: google.maps.PolylineOptions = {
    strokeColor: 'blue',
    strokeOpacity: 1,
    strokeWeight: 3
  };

  polylineOptionsOrange: google.maps.PolylineOptions = {
    strokeColor: 'orange',
    strokeOpacity: 1,
    strokeWeight: 4
  };

  suggestedRoute: google.maps.LatLngLiteral[] = [];
  correctedRoute: google.maps.LatLngLiteral[] = [];
  actualRoute: google.maps.LatLngLiteral[] = [];
  bounds = new google.maps.LatLngBounds();
  @Input() trip!: IVehicleTripLogFullDto;

  constructor(private displayTripFormService: DisplayTripFormService) { }

  ngOnInit() {
    this.initializeTripData();
    this.subscribeToCloseAll();
    this.setCurrentLocation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trip && !changes.trip.firstChange) {
      this.initializeTripData();
    }
  }

  private initializeTripData() {
    if (!this.trip) {
      console.error('Trip data is not available');
      return;
    }

    this.vehicleTripLogFullDto = this.trip;
    this.correctedRoute = this.decodeRoute(this.vehicleTripLogFullDto?.correctedRoute);
    this.suggestedRoute = this.decodeRoute(this.vehicleTripLogFullDto?.suggestedRoute);
    this.actualRoute = this.decodeRoute(this.vehicleTripLogFullDto?.actualRoute);
    this.extendBounds(this.actualRoute);
    this.extendBounds(this.suggestedRoute);
  }

  private subscribeToCloseAll() {
    this.closeSubscription = this.displayTripFormService.closeAll$.subscribe(() => {
      this.close();
    });
    this.displayTripFormService.closeAll();
  }

  private setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  private decodeRoute(encodedPath: string): google.maps.LatLngLiteral[] {
    if (!encodedPath) return [];
    const path = google.maps.geometry.encoding.decodePath(encodedPath);
    return path.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
  }

  private extendBounds(route: google.maps.LatLngLiteral[]): void {
    if (route.length > 2) {
      route.forEach((point) => this.bounds.extend(point));
    }
  }

  public onMapReady(map: google.maps.Map): void {
    map.fitBounds(this.bounds, 20);
  }

  toMinutes(seconds: number) {
    return seconds / 60;
  }

  toKilometers(meters: number) {
    return meters / 1000;
  }

  canManageRoles() {
    return true;
  }

  ngOnDestroy(): void {
    this.closeSubscription.unsubscribe();
  }

  private close() {
    if (this.tripDialog) {
      this.tripDialog.hide();
    }
  }
}
