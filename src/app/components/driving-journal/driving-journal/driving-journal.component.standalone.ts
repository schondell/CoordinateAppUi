import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CalendarView } from "@syncfusion/ej2-angular-calendars";
import { AppTranslationService } from '../../../services/app-translation.service';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DateVehicleSelectorStandaloneComponent } from '../../../shared/date-vehicle-selector/date-vehicle-selector.component.standalone';
import { DrivingJournalTableComponent } from '../driving-journal-table/driving-journal-table.component';

@Component({
  selector: 'app-driving-journal-standalone',
  templateUrl: './driving-journal.component.standalone.html',
  styleUrls: ['./driving-journal.component.standalone.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    DateVehicleSelectorStandaloneComponent,
    DrivingJournalTableComponent
  ],
  providers: [
    { provide: 'sourceFiles', useValue: { files: ['month-picker.css'] } }
  ]
})
export class DrivingJournalStandaloneComponent implements OnInit {
  year: number;
  month: number;
  vehicleId: number;
  public start: CalendarView = 'Year';
  public depth: CalendarView = 'Year';
  public format: string = 'MMMM y';

  currentDate: Date;
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
      
      // Default to current date values if not provided in the URL
      if (isNaN(this.selectedYear) || isNaN(this.selectedMonth)) {
        const now = new Date();
        this.selectedYear = now.getFullYear();
        this.selectedMonth = now.getMonth() + 1;
      }
      
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
      console.log(`onDateChange DrivingJournalComponent- Date changed: year=${this.selectedYear}, month=${this.selectedMonth}`);
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
}