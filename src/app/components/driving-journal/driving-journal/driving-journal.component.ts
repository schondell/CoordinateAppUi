import {Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarView } from "@syncfusion/ej2-angular-calendars";
import { AppTranslationService } from '../../../services/app-translation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-driving-journal',
  templateUrl: './driving-journal.component.html',
  styleUrls: ['./driving-journal.component.scss'],
  providers: [
    { provide: 'sourceFiles', useValue: { files: ['month-picker.css'] } }
  ]
})
export class DrivingJournalComponent implements OnInit {
  year: number;
  month: number;
  vehicleId: number;
  public start: CalendarView = 'Year';
  public depth: CalendarView = 'Year';
  public format: string = 'MMMM y';

  currentDate : Date ;
  selectedVehicleId: number;
  selectedYear: number;
  selectedMonth: number;
  allValuesOk: boolean;
  isTableVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translate: AppTranslationService
  ) {
    this.translate.useBrowserLanguage();
    this.currentDate = new Date(); // Initialize with the current date
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedYear = +params['year']; // Convert to number
      this.selectedMonth = +params['month']; // Convert to number
      this.selectedVehicleId = +params['vehicleId']; // Convert to number
      this.showTable();
      this.change(this.selectedYear, this.selectedMonth, this.selectedVehicleId);
    });
  }

  onDateChange(date: Date) {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth() + 1; // getMonth() is zero-based

    if (this.selectedYear !== newYear || this.selectedMonth !== newMonth) {
      this.selectedYear = newYear;
      this.selectedMonth = newMonth;
      console.log(`onDateChange  DrivingJournalComponent- Date changed: year=${this.selectedYear}, month=${this.selectedMonth}`);
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

  updateAllValuesOk() {
    this.allValuesOk = !!this.selectedVehicleId && !isNaN(this.selectedYear) && !isNaN(this.selectedMonth);
    console.log(`updateAllValuesOk - allValuesOk=${this.allValuesOk}`);
  }

  change(year: number, month: number, vehicleId: number) {
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedVehicleId = vehicleId;
    console.log(`change - Parameters updated: year=${this.selectedYear}, month=${this.selectedMonth}, vehicleId=${this.selectedVehicleId}`);
  }

  hideTable() {
    this.isTableVisible = false;
  }

  showTable() {
    this.isTableVisible = true;
  }

  onFindClick() {
    if (!isNaN(this.selectedYear) && !isNaN(this.selectedMonth) && !isNaN(this.selectedVehicleId)) {
      console.log(`onFindClick year=${this.selectedYear}, month=${this.selectedMonth}, vehicleId=${this.selectedVehicleId}`);
      this.location.replaceState(`/journal/year/${this.selectedYear}/month/${this.selectedMonth}/vehicleId/${this.selectedVehicleId}`);
      this.showTable();
    } else {
      console.error('onFindClick - One or more parameters are NaN');
    }
  }


  // onFindClick($event: { vehicleId: number; date: Date }) {
  //   const { vehicleId, date } = $event;
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1; // getMonth() is zero-based
  //
  //   if (!isNaN(year) && !isNaN(month) && !isNaN(vehicleId)) {
  //     console.log(`Navigating to /journal/year/${year}/month/${month}/vehicleId/${vehicleId}`);
  //     const url = encodeURI(`/journal/year/${year}/month/${month}/vehicleId/${vehicleId}`);
  //     this.location.replaceState(url);
  //   } else {
  //     console.error('One or more parameters are NaN');
  //   }
  // }
}
