import { Component, OnInit } from '@angular/core';
import { VehicleDto } from '../../../models/generatedtypes';
//import polyline from '@mapbox/polyline';
import { DrivingInfo, SinoCastelObd2AlarmDto2 } from '../../../models/IRouteInput';
import { formatNumber, formatDate } from '@angular/common';


@Component({
  selector: 'app-vehiche-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.scss']
})
export class VehicleMapComponent implements OnInit {

  name: string;
  speed: string;
  distance: string;
  status: string;
  timeStamp: string;

  Id: number;
  //layerGroup: LayerGroup;
  //drivePath: L.Polyline;
  //startPoint: Marker;
  //endPoint: Marker;

  constructor(vehicleDto: VehicleDto) {
    this.name = vehicleDto.name;
    this.Id = vehicleDto.vehicleId;
   // this.layerGroup = mainMapLayerGroup;
   // this.drivePath = null;
  }

  update(drivingInfo: DrivingInfo, currentLocale: string ) {
    if (drivingInfo !== null) {
      if (drivingInfo.lastPathSegment !== null && drivingInfo.lastPathSegment != undefined /*&& this.drivePath != null*/ ) {
      //const path = polyline.decode(drivingInfo.lastPathSegment);
   //   for (const coordinate of path) {
   //     this.drivePath.addLatLng(L.latLng(coordinate[0], coordinate[1]));
    //  }
    } else
      if (drivingInfo.encodedPath !== null) {
       // const existingPoints = polyline.decode(drivingInfo.encodedPath);
        // if (this.layerGroup !== null) {
        //   if (this.drivePath !== null) {
        //     this.layerGroup.removeLayer(this.drivePath);
        //   }
        //   this.drivePath = L.polyline(existingPoints, {
        //     color: 'blue',
        //    // weight: 5,
        //     smoothFactor: 1
        //   });
        //   this.layerGroup.addLayer(this.drivePath);
       // }
      }

      this.speed =  formatNumber(drivingInfo.speed, currentLocale , "1.0-0");
      this.distance =  formatNumber(this.toKilometers(drivingInfo.distance), currentLocale , "1.0-0");
      this.timeStamp = formatDate(drivingInfo.timeStamp, "HH:MM", currentLocale ,"CET");

      if (drivingInfo.isIdling) {
        this.status = 'Idling'; // TODO get localized values
      } else {
        this.status = 'Driving';
      }
    }
  }

toKilometers(distance: number) {
  return(distance / 1000);
}

  updateEvent(sinoCastelObd2AlarmDto: SinoCastelObd2AlarmDto2) {
  //  const markerLayer = this.getEventMarker(sinoCastelObd2AlarmDto.Alarm, sinoCastelObd2AlarmDto.Latitude, sinoCastelObd2AlarmDto.Longitude);
  //  this.layerGroup.addLayer(markerLayer);
  }

  // getEventMarker(name: string, latitude: number, longitude: number): Marker {
  //   const eventMarker = L.marker([latitude, longitude],
  //     {
  //       // title: name,
  //       icon: icon({
  //         iconSize: [25, 41],
  //         iconAnchor: [13, 41],
  //         iconUrl: 'leaflet/marker-icon.png',
  //         shadowUrl: 'leaflet/marker-shadow.png'
  //       })
  //     }).bindPopup(name);
  //
  //   // tslint:disable-next-line:no-console
  //   console.debug(eventMarker);
  //   return eventMarker;
  // }

  ngOnInit() {
  }
}
