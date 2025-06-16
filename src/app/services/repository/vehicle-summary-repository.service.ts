import {Injectable, Injector} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleSummary } from '../../models/vehicle-summary';
import {ConfigurationService} from "../configuration.service";
import {catchError, map} from "rxjs/operators";
import {EndpointBase} from "../endpoint-base.service";
import {AuthService} from "../auth.service";
@Injectable({
  providedIn: 'root',
})

export class VehicleSummaryRepositoryService extends EndpointBase {
  private readonly itemUrl: string;

  constructor(http: HttpClient, configurations: ConfigurationService, authService: AuthService) {
    super(http, authService);
    this.itemUrl = configurations.baseUrl + '/api/VehicleSummary/';
  }

  getAllVehicleSummaries(): Observable<VehicleSummary[]> {
    const endpointUrl = `${this.itemUrl}GetAllVehicleSummary`;
    return this.http.get<any[]>(endpointUrl, this.getRequestHeaders()).pipe(
      map(vehicles => vehicles.map(vehicle => this.mapApiResponseToVehicleSummary(vehicle))),
      catchError(error => {
        return this.handleError(error, () => this.getAllVehicleSummaries());
      })
    );
  }

  private mapApiResponseToVehicleSummary(apiResponse: any): VehicleSummary {
    const vehicle = new VehicleSummary();
    
    console.log('Mapping API response:', apiResponse);
    
    // Copy basic properties
    vehicle.tenantId = apiResponse.tenantId;
    vehicle.vehicleId = apiResponse.vehicleId;
    vehicle.name = apiResponse.name;
    vehicle.model = apiResponse.model;
    vehicle.modelYear = apiResponse.modelYear;
    vehicle.make = apiResponse.make;
    vehicle.polyLineRoute = apiResponse.polyLineRoute;
    vehicle.alarms = apiResponse.alarms || [];
    
    // Map properties from first alarm if available
    if (apiResponse.alarms && apiResponse.alarms.length > 0) {
      const firstAlarm = apiResponse.alarms[0];
      vehicle.latitude = firstAlarm.latitude;
      vehicle.longitude = firstAlarm.longitude;
      vehicle.speed = firstAlarm.speed;
      vehicle.heading = firstAlarm.heading;
      vehicle.description = firstAlarm.description;
      vehicle.deviceTimestamp = new Date(firstAlarm.deviceTimestamp);
      vehicle.currentTripMileage = firstAlarm.currentTripMileage;
      vehicle.alarm = firstAlarm.alarm;
      vehicle.geoHash = firstAlarm.geoHash;
      vehicle.sinoCastelObd2AlarmId = firstAlarm.sinoCastelObd2AlarmId?.toString() || '';
      vehicle.deviceIdentity = firstAlarm.deviceIdentity;
      vehicle.messageTypeStrong = firstAlarm.messageTypeStrong;
      vehicle.latestAccOnTime = new Date(firstAlarm.latestAccOnTime);
      vehicle.totalTripMileage = firstAlarm.totalTripMileage;
      vehicle.totalFuelConsumption = firstAlarm.totalFuelConsumption;
      vehicle.currentTripFuelConsumption = firstAlarm.currentTripFuelConsumption;
      vehicle.correlationIdentity = firstAlarm.correlationIdentity;
      vehicle.day = firstAlarm.day;
      vehicle.month = firstAlarm.month;
      vehicle.year = firstAlarm.year;
      
      console.log(`Mapped vehicle ${vehicle.name}: lat=${vehicle.latitude}, lng=${vehicle.longitude}`);
    } else {
      console.log(`No alarms found for vehicle ${vehicle.name}`);
    }
    
    return vehicle;
  }

  getTodaysVehicleSummaries(): Observable<VehicleSummary[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const endpointUrl = `${this.itemUrl}GetVehicleSummariesByDate?date=${today}`;
    return this.http.get<any[]>(endpointUrl, this.getRequestHeaders()).pipe(
      map(vehicles => vehicles.map(vehicle => this.mapApiResponseToVehicleSummary(vehicle))),
      catchError(error => {
        return this.handleError(error, () => this.getTodaysVehicleSummaries());
      })
    );
  }
}
