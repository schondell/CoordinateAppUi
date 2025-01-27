import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  standalone: true,
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements AfterViewInit {
  @ViewChild('map1ElementRef', { static: false }) map1ElementRef!: ElementRef;
  private map1!: google.maps.Map;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initializeMap();
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
    });
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
