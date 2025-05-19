import { Component, OnInit, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { CalendarView } from "@syncfusion/ej2-angular-calendars";
import { IDropDownItemWithDate } from "../../models/DropDownItemWithDate";
import { VehicleRepository } from '../../services/generated/vehicle-repository';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-date-vehicle-selector',
  templateUrl: './date-vehicle-selector.component.html',
  styleUrls: ['./date-vehicle-selector.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DatePickerModule,
    DropDownListModule,
    ButtonModule
  ]
})
export class DateVehicleSelectorComponent implements OnInit {
  public start: CalendarView = 'Year';
  public depth: CalendarView = 'Year';
  public format: string = 'MMMM y';
  currentDate: FormControl;
  vehicles: IDropDownItemWithDate[] = [];
  filteredVehicles: IDropDownItemWithDate[] = [];
  selectedVehicleId: number;
  public localFields: object = { text: 'name', value: 'id' };
  isFindButtonVisible: boolean = false;

  @Output() dateChange = new EventEmitter<Date>();
  @Output() vehicleChange = new EventEmitter<number>();
  @Output() findClick = new EventEmitter<void>();

  constructor(private vehicleRepository: VehicleRepository) {
    const now = new Date();
    this.currentDate = new FormControl(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  ngOnInit() {
    this.currentDate.valueChanges.subscribe(value => {
      this.dateChange.emit(value);
      this.updateFindButtonVisibility();
    });

    this.vehicleRepository.getVehiclesDropDownItems().subscribe(data => {
      this.vehicles = data;
      this.filteredVehicles = data; // Initialize filteredVehicles with the same elements as data
    });
  }

  onVehicleChange() {
    this.updateFindButtonVisibility();
    this.vehicleChange.emit(this.selectedVehicleId);
  }

  onDateChange($event: any) {
    const selectedDate = $event.value;
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    // Filter vehicles based on the selected month and year
    const firstDayOfSelectedMonth = new Date(selectedYear, selectedMonth, 1);

    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const vehicleDate = new Date(vehicle.date); // Assuming vehicle.date is a valid date string
      return vehicleDate >= firstDayOfSelectedMonth;
    });

    this.updateFindButtonVisibility();
    this.dateChange.emit(selectedDate);
  }

  updateFindButtonVisibility() {
    this.isFindButtonVisible = !!this.currentDate.value && !!this.selectedVehicleId;
  }

  onFindClick() {
    this.findClick.emit();
  }
}