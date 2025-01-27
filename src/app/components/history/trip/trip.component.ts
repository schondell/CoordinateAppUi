import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IVehicleTripLogFullDto } from 'src/app/models/generatedtypes';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {
  private _trip: IVehicleTripLogFullDto;
  @Input() trips: IVehicleTripLogFullDto[];
  @Input() currentIndex: number;
  @ViewChild('tripDialog') public tripDialog: DialogComponent;

  constructor(private cdr: ChangeDetectorRef) { }

  @Input()
  set trip(trip: IVehicleTripLogFullDto) {
    this._trip = trip;
  }

  get trip(): IVehicleTripLogFullDto { return this._trip; }

  ngOnInit() { }

  toKilometers(meters: number): number {
    return meters / 1000;
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat(navigator.language, {
      timeStyle: 'short'
    }).format(new Date(date));
  }

  formatHeader(trip: IVehicleTripLogFullDto): string {
    const duration = this.formatDuration(trip.durationInMinutes);
    const distance = this.toKilometers(trip.distance).toFixed(1);
    const header = `${this.formatTime(trip.started)} ${trip.addressStart.name}, -> ${this.formatTime(trip.ended)}: ${trip.addressStart.name}, ${duration}, ${distance} km`;
    this.trip.description = header;
    return header;
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }

  displayTrip(trip: IVehicleTripLogFullDto): void {
    this.trip = trip;
    this.tripDialog.show();
  }

  previousTrip() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.trip = this.trips[this.currentIndex];
    }
  }

  nextTrip() {
    if (this.currentIndex < this.trips.length - 1) {
      this.currentIndex++;
      this.trip = this.trips[this.currentIndex];
    }
  }
}