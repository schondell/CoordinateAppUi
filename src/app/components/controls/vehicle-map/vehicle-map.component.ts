import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleDto } from '../../../models/generatedtypes';
import * as polyline from '@mapbox/polyline';
import { DrivingInfo, SinoCastelObd2AlarmDto2 } from '../../../models/IRouteInput';
import { formatNumber, formatDate } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';


@Component({
  selector: 'app-vehiche-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule
  ]
})
export class VehicleMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  name: string;
  speed: string;
  distance: string;
  status: string;
  timeStamp: string;

  Id: number;
  
  // Google Maps properties
  mapOptions: google.maps.MapOptions = {
    center: { lat: 59.3293, lng: 18.0686 }, // Default to Stockholm
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false
  };
  
  mapLoaded = false;
  markers: google.maps.Marker[] = [];
  drivePath: google.maps.Polyline;
  eventMarkers: google.maps.Marker[] = [];

  constructor(vehicleDto: VehicleDto) {
    this.name = vehicleDto.name;
    this.Id = vehicleDto.vehicleId;
  }

  ngAfterViewInit() {
    // Initialize the map after the view is loaded
    this.initMap();
  }

  initMap() {
    // Check if Google Maps is loaded
    if (this.mapContainer && google && google.maps) {
      this.mapLoaded = true;
      // Map is already initialized by the directive
      console.log('Google Maps initialized successfully');
    } else {
      console.error('Google Maps not loaded');
    }
  }

  update(drivingInfo: DrivingInfo, currentLocale: string) {
    if (drivingInfo === null || !this.mapLoaded) return;

    // Update info text
    this.speed = formatNumber(drivingInfo.speed, currentLocale, "1.0-0");
    this.distance = formatNumber(this.toKilometers(drivingInfo.distance), currentLocale, "1.0-0");
    this.timeStamp = formatDate(drivingInfo.timeStamp, "HH:MM", currentLocale, "CET");
    this.status = drivingInfo.isIdling ? 'Idling' : 'Driving';

    // Update map with path
    if (this.mapLoaded && this.googleMap?.googleMap) {
      // Handle last path segment if available
      if (drivingInfo.lastPathSegment) {
        this.updatePathSegment(drivingInfo.lastPathSegment);
      } 
      // Or handle full encoded path if available
      else if (drivingInfo.encodedPath) {
        this.updateFullPath(drivingInfo.encodedPath);
      }
    }
  }

  updatePathSegment(encodedSegment: string) {
    try {
      const path = polyline.decode(encodedSegment);
      const googlePath = path.map(point => ({
        lat: point[0],
        lng: point[1]
      }));

      if (this.drivePath) {
        // Append to existing path
        const currentPath = this.drivePath.getPath();
        googlePath.forEach(point => {
          currentPath.push(new google.maps.LatLng(point.lat, point.lng));
        });
      } else {
        // Create new path if none exists
        this.updateFullPath(encodedSegment);
      }
    } catch (e) {
      console.error('Error updating path segment:', e);
    }
  }

  updateFullPath(encodedPath: string) {
    try {
      // Clear existing path if any
      if (this.drivePath) {
        this.drivePath.setMap(null);
      }

      // Decode the polyline
      const path = polyline.decode(encodedPath);
      const googlePath = path.map(point => ({
        lat: point[0],
        lng: point[1]
      }));

      // Create new polyline
      this.drivePath = new google.maps.Polyline({
        path: googlePath,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      // Add to map
      this.drivePath.setMap(this.googleMap.googleMap);

      // Set map center to middle of path or last point
      if (googlePath.length > 0) {
        const midIndex = Math.floor(googlePath.length / 2);
        this.googleMap.panTo(googlePath[midIndex]);
      }

      // Add start and end markers
      if (googlePath.length > 0) {
        this.addMarker(googlePath[0], 'Start');
        this.addMarker(googlePath[googlePath.length - 1], 'Current Position');
      }
    } catch (e) {
      console.error('Error updating full path:', e);
    }
  }

  addMarker(position: google.maps.LatLngLiteral, title: string) {
    if (!this.googleMap?.googleMap) return;
    
    const marker = new google.maps.Marker({
      position,
      map: this.googleMap.googleMap,
      title
    });
    
    this.markers.push(marker);
    
    // Add click listener for info window
    marker.addListener('click', () => {
      const infoContent = `<div><strong>${title}</strong></div>`;
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      infoWindow.open(this.googleMap.googleMap, marker);
    });
  }

  toKilometers(distance: number) {
    return (distance / 1000);
  }

  updateEvent(event: SinoCastelObd2AlarmDto2) {
    if (!this.mapLoaded || !this.googleMap?.googleMap || !event) return;
    
    // Add event marker to map
    const position = {
      lat: event.Latitude,
      lng: event.Longitude
    };
    
    const marker = new google.maps.Marker({
      position,
      map: this.googleMap.googleMap,
      title: event.Alarm,
      icon: {
        url: 'assets/images/event-marker.png',
        scaledSize: new google.maps.Size(24, 24)
      }
    });
    
    this.eventMarkers.push(marker);
    
    // Add info window
    marker.addListener('click', () => {
      const infoContent = `
        <div>
          <h3>${event.Alarm}</h3>
          <p>Timestamp: ${event.Time}</p>
        </div>
      `;
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      infoWindow.open(this.googleMap.googleMap, marker);
    });
  }

  ngOnInit() {
    // No operations needed here since we're using AfterViewInit
  }
}
