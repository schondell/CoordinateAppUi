import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleTripLogFullDto } from 'src/app/models/generatedtypes';
import { IRouteResponse } from 'src/app/models/IRouteInput';
import * as polyline from '@mapbox/polyline';
import { TripHistoryEntry } from 'src/app/models/VehicleTripLogFullDto2';
import {GoogleMap} from "@angular/google-maps";

//declare let L;

@Component({
  selector: 'app-display-multi-trip-form',
  templateUrl: './display-multi-trip-form.component.html',
  styleUrls: ['./display-multi-trip-form.component.scss']
})
export class DisplayMultiTripFormComponent implements OnInit {
  @ViewChild(GoogleMap, {static: false}) routeMap: GoogleMap
  tripHistoryEntry: TripHistoryEntry;
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

  bounds = new google.maps.LatLngBounds();
  allTrips: VehicleTripLogFullDtoExtended[] = [];
  isTripsLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<DisplayMultiTripFormComponent>,
    @Inject(MAT_DIALOG_DATA) public tripHistory: TripHistoryEntry,
  ) {
    this.tripHistoryEntry = tripHistory;

    this.allTrips = this.tripHistoryEntry.vehicleTripLogFullDtos.map(trip => new VehicleTripLogFullDtoExtended(trip));

    this.allTrips.map((trip) => this.calculateBound(trip.suggestedRouteArray, trip.actualRouteArray));
    this.isTripsLoaded = true;
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  public calculateBound (suggestedRouteArray: google.maps.LatLngLiteral[] , actualRouteArray: google.maps.LatLngLiteral[]) {
    if (suggestedRouteArray.length > 2) {
      for (let n = 0; n < actualRouteArray.length; n++) {
        this.bounds.extend(actualRouteArray[n]);
      }
    } else {
      if (suggestedRouteArray.length > 2) {
        for (let n = 0; n < suggestedRouteArray.length; n++) {
          this.bounds.extend(suggestedRouteArray[n]);
        }
      }
    }
  }

  public onMapReady(map: google.maps.Map): void {
    map.fitBounds(this.bounds, 20);
  }

cancel() {
  this.dialogRef.close(null);
}

toMinutes(seconds: number) {
  return seconds / 60;
}

toKilometers(meters: number) {
  return meters / 1000;
}

onClose() {
  this.dialogRef.close();
}
  canManageRoles() {
    return true;
  }
}

class VehicleTripLogFullDtoExtended extends VehicleTripLogFullDto {
  public duration: number;

  public suggestedRouteArray: google.maps.LatLngLiteral[]  = []
  public actualRouteArray: google.maps.LatLngLiteral[] = []

  constructor(obj: VehicleTripLogFullDto) {
    // Call the super constructor
    super();
    // Copy all properties of the passed object to this instance
    Object.assign(this, obj);

    this.suggestedRouteArray = [];
    this.actualRouteArray = [];

    try {
      const suggestedRoute = polyline.decode(obj.suggestedRoute);
      this.suggestedRouteArray = suggestedRoute
        .filter(latLng => {
          const lat = Number(latLng[0]);
          const lng = Number(latLng[1]);
          const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
          const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
          return isValidLat && isValidLng;
        })
        .map(latLng => ({ lat: latLng[0], lng: latLng[1] }));
    } catch (error) {
      console.error('Error decoding suggested route:', error);
      this.suggestedRouteArray = [];
    }

    try {
      const actualRoute = polyline.decode(obj.actualRoute);
      this.actualRouteArray = actualRoute
        .filter(latLng => {
          const lat = Number(latLng[0]);
          const lng = Number(latLng[1]);
          const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
          const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
          return isValidLat && isValidLng;
        })
        .map(latLng => ({ lat: latLng[0], lng: latLng[1] }));
    } catch (error) {
      console.error('Error decoding actual route:', error);
      this.actualRouteArray = [];
    }
    }
}


