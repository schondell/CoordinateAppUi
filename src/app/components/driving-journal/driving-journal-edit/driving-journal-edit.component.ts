import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { vehicleJournal } from 'src/app/models/vehicle-journal';

@Component({
  selector: 'app-driving-journal-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './driving-journal-edit.component.html',
  styleUrls: ['./driving-journal-edit.component.scss']
})
export class DrivingJournalEditComponent {
  @Input() data: vehicleJournal;
  @Output() save = new EventEmitter<vehicleJournal>();
  vehicleJournalDto: vehicleJournal;

  onSave() {
    this.save.emit(this.data);
  }
}
