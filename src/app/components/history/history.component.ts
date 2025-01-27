import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleTripLogFullRepositoryEx } from 'src/app/services/repository/vehicle-trip-log-full-ex-repository';
import { TripHistoryModel } from 'src/app/models/VehicleTripLogFullDto2';
import {DatePipe, DecimalPipe, Location} from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [
    { provide: 'sourceFiles', useValue: { files: ['month-picker.css'] } }
  ]
})
export class HistoryComponent implements OnInit, OnDestroy {
  tripHistoryModel: TripHistoryModel = new TripHistoryModel();
  selectedYear: number;
  selectedMonth: number;
  selectedVehicleId: number;
  allValuesOk: boolean;

  constructor(
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private vehicleTripLogFullRepositoryEx: VehicleTripLogFullRepositoryEx,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    @Inject('sourceFiles') private sourceFiles: any) {
    sourceFiles.files = ['month-picker.css'];
  }

  ngOnDestroy(): void {
    // Implement your ngOnDestroy logic here
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedYear = +params['year']; // Convert to number
      this.selectedMonth = +params['month']; // Convert to number
      this.selectedVehicleId = +params['vehicleId']; // Convert to number

      console.log(`ngOnInit - Params: year=${this.selectedYear}, month=${this.selectedMonth}, vehicleId=${this.selectedVehicleId}`);
      this.updateAllValuesOk();
      this.change(this.selectedYear, this.selectedMonth, this.selectedVehicleId);
    });
  }

  updateAllValuesOk() {
    this.allValuesOk = !!this.selectedVehicleId && !isNaN(this.selectedYear) && !isNaN(this.selectedMonth);
    console.log(`updateAllValuesOk - allValuesOk=${this.allValuesOk}`);
  }

  toKilometers(meters: number) {
    return meters / 1000;
  }

  onDateChange(date: Date) {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth() + 1; // getMonth() is zero-based

    if (this.selectedYear !== newYear || this.selectedMonth !== newMonth) {
      this.selectedYear = newYear;
      this.selectedMonth = newMonth;
      console.log(`onDateChange - Date changed: year=${this.selectedYear}, month=${this.selectedMonth}`);
      this.hideTable();
      this.updateAllValuesOk();
    } else {
      console.log('onDateChange - No change in date');
    }
  }

  onVehicleChange(vehicleId: number) {
    if (this.selectedVehicleId !== vehicleId) {
      this.selectedVehicleId = vehicleId;
      console.log(`onVehicleChange - Vehicle changed: vehicleId=${this.selectedVehicleId}`);
      this.hideTable();
      this.updateAllValuesOk();
    } else {
      console.log('onVehicleChange - No change in vehicle');
    }
  }

  change(year: number, month: number, vehicleId: number) {
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedVehicleId = vehicleId;
    console.log(`change - Parameters updated: year=${this.selectedYear}, month=${this.selectedMonth}, vehicleId=${this.selectedVehicleId}`);
  }

  onFindClick() {
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const vehicleId = this.selectedVehicleId;

    console.log(`onFindClick - Click event: year=${year}, month=${month}, vehicleId=${vehicleId}`);

    if (!isNaN(year) && !isNaN(month) && !isNaN(vehicleId)) {
      this.vehicleTripLogFullRepositoryEx.getVehicleTripLogHistoryFromMonthYear(vehicleId, year, month)
        .subscribe(data => {
          console.log('onFindClick - Data received:', data);
          this.tripHistoryModel = data;
          console.log('onFindClick - tripHistoryModel set:', this.tripHistoryModel);
          this.updateAllValuesOk(); // Update allValuesOk after data is loaded
          this.cdr.detectChanges(); // Manually trigger change detection

          // Update the URL with the selected year, month, and vehicle ID without reloading the component
          this.location.replaceState(`/history/year/${year}/month/${month}/vehicleId/${vehicleId}`);
        }, error => {
          console.error('onFindClick - Error fetching data:', error);
        });
    } else {
      console.error('onFindClick - One or more parameters are NaN');
    }
  }
  onButtonClick() {
    // Implement your button click logic here
  }

  formatHeader(tripHistoryEntry: any): string {
    const date = this.datePipe.transform(tripHistoryEntry?.groupDate, 'longDate');
    const distance = this.decimalPipe.transform(this.toKilometers(tripHistoryEntry?.totalDistance), '1.1-1');
    const duration = this.formatDuration(tripHistoryEntry?.totalDuration);
    const trips = tripHistoryEntry?.numberOfTrips;
    return `${date}: ${distance} km, ${duration}, ${trips} trips`;
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  private hideTable() {
    this.tripHistoryModel = null;
  }
}
