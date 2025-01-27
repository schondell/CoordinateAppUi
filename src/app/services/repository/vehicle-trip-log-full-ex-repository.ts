import { Injectable } from "@angular/core";
import {HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ConfigurationService } from "../configuration.service";
import { IVehicleTripLogFullDtoApi } from "../../models/generatedtypes";
import { TripResponse } from "src/app/models/IRouteInput";
import { TripHistoryModel } from "src/app/models/VehicleTripLogFullDto2";
import {EndpointBase} from "../endpoint-base.service";
import {AuthService} from "../auth.service";
import {VehicleJournalApi} from "../../models/vehicle-journal-api";
import {vehicleJournal} from "../../models/vehicle-journal";

@Injectable({ providedIn: "root" })
export class VehicleTripLogFullRepositoryEx extends EndpointBase {
  private readonly itemUrl: string;
  constructor(http: HttpClient, configurations: ConfigurationService, authService: AuthService) {
    super(http, authService);
    this.itemUrl = configurations.baseUrl + '/api/VehicleTripLogFullDtoExt/';
  }

  getVehicleJournalFromMonthYear(vehicleId: number, month: number, year: number): Observable<VehicleJournalApi> {
    const endpointUrl = `${this.itemUrl}GetVehicleJournalFromMonthYear?vehicleId=${vehicleId}&month=${month}&year=${year}`;

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleJournalFromMonthYear(vehicleId, month, year));
      }));
  }

  getVehicleTripLogFullsFromMonthYear(vehicleId: number, month: number, year: number): Observable<IVehicleTripLogFullDtoApi> {
    const endpointUrl = `${this.itemUrl}GetVehicleTripLogFullFromMonthYear?vehicleId=${vehicleId}&month=${month}&year=${year}`;

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleTripLogFullsFromMonthYear(vehicleId, month, year));
      }));
  }

  getVehicleTripLogHistoryFromMonthYear(vehicleId: number, year: number, month: number): Observable<TripHistoryModel> {
    const endpointUrl = `${this.itemUrl}GetVehicleTripLogHistoryFromMonthYear?vehicleId=${vehicleId}&month=${month}&year=${year}`;

    return this.http.get<TripHistoryModel>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleTripLogHistoryFromMonthYear(vehicleId, year, month));
      })
    );
  }

  getAllVehicleTripLogFullFromLastMonth(vehicleId: number): Observable<TripHistoryModel> {
    const endpointUrl = `${this.itemUrl}GetAllVehicleTripLogFullFromLastMonth?vehicleId=${vehicleId}`;

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllVehicleTripLogFullFromLastMonth(vehicleId));
      }));
  }

  getVehicleTripLogBetweenDates(vehicleId: number, from: Date): Observable<TripResponse> {
    const endpointUrl = `${this.itemUrl}SelectGeoCoordinateForVehicleBetweenTimes?vehicleId=${vehicleId}&from=${from}`;

    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getVehicleTripLogBetweenDates(vehicleId, from));
      }));
  }

  updatePurposeOfTrip(data: vehicleJournal): Observable<any> {
    const endpointUrl = `${this.itemUrl}GetAllVehicleTripLogFullFromLastMonth?vehicleId=${data.vehicleTripLogId}`;
    return this.http.put(`${endpointUrl}`, data);
  }
}
