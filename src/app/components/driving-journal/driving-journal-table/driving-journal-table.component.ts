import {Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { of as observableOf } from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {DialogComponent, DialogModule} from '@syncfusion/ej2-angular-popups';
import { fadeInOut } from "../../../services/animations";
import { VehicleTripLogFullRepositoryEx } from "../../../services/repository/vehicle-trip-log-full-ex-repository";
import { GridComponent, GridModule, ToolbarItems, PdfExportProperties as GridPdfExportProperties } from "@syncfusion/ej2-angular-grids";
import { TranslateModule } from "@ngx-translate/core";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { VehicleJournalApi } from "../../../models/vehicle-journal-api";
import { FormsModule } from "@angular/forms";
import { vehicleJournal } from 'src/app/models/vehicle-journal';
import { DrivingJournalEditComponent } from '../driving-journal-edit/driving-journal-edit.component';
import {RecordDoubleClickEventArgs} from "@syncfusion/ej2-angular-gantt";

@Component({
  selector: 'app-driving-journal-table',
  templateUrl: './driving-journal-table.component.html',
  styleUrls: ['./driving-journal-table.component.scss'],
  standalone: true,
  imports: [
    GridModule,
    FormsModule,
    TranslateModule,
    DrivingJournalEditComponent,
    DialogModule
  ],
  animations: [fadeInOut]
})
export class DrivingJournalTableComponent implements OnInit, AfterViewInit {
  @Input() parentVehicleId: number;
  @Input() parentStartYear: number;
  @Input() parentEndMonth: number;
  @ViewChild('dialog', { static: false }) dialog: DialogComponent;
  @ViewChild('grid', { static: false }) public grid?: GridComponent;
  @ViewChild(DrivingJournalEditComponent, { static: false }) editComponent: DrivingJournalEditComponent;

  dataSource: VehicleTripLogFullRepositoryEx | null;
  vehicleJournalDtos: vehicleJournal[] = []; // Change type here
  selectedData: vehicleJournal;
  isLoadingResults = true;
  isRateLimitReached = false;
  public toolbarOptions?: ToolbarItems[];

  dateFormat: string;

  constructor(
      private vehicleTripLogFullRepositoryEx: VehicleTripLogFullRepositoryEx,
      private changeDetectorRef: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.dateFormat = new Intl.DateTimeFormat(navigator.language).resolvedOptions().locale;
  }

  ngOnInit() {
    this.dataSource = this.vehicleTripLogFullRepositoryEx;
    this.toolbarOptions = ['PdfExport', 'ExcelExport'];
    this.setDefaultDates();
  }

  setDefaultDates() {
    if (!this.parentEndMonth && !this.parentStartYear) {
      const now = new Date();
      this.parentEndMonth = now.getMonth() + 1;
      this.parentStartYear = now.getFullYear();
    }
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'driving-journal-table-grid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const pdfExportProperties: GridPdfExportProperties = {
        pageOrientation: 'Landscape'
      };
      (this.grid as GridComponent).pdfExport(pdfExportProperties);
    }
    if (args.item.id === 'driving-journal-table-grid_excelexport') {
      (this.grid as GridComponent).excelExport();
    }
  }

  onRowDblClick(args: RecordDoubleClickEventArgs) {
    this.selectedData = args.rowData as vehicleJournal;
    if (this.editComponent) {
      this.editComponent.vehicleJournalDto = this.selectedData;
      this.dialog.show();
    } else {
      console.error('Edit component is not initialized');
    }
  }

  saveChanges(updatedData: vehicleJournal) {
    // Save changes logic
    this.selectedData = updatedData;
    this.dialog.hide();
  }

  loadData() {
    this.isLoadingResults = true;
    console.log(`loadData - parentVehicleId: year=${this.parentStartYear}, month=${this.parentEndMonth}, vehicleId=${this.parentVehicleId}`);

    this.dataSource?.getVehicleJournalFromMonthYear(this.parentVehicleId, this.parentEndMonth, this.parentStartYear)
        .pipe(
            map((data: VehicleJournalApi) => data.vehicleJournals || []),
            catchError(() => observableOf([])),
            finalize(() => {
              this.isLoadingResults = false;
              this.isRateLimitReached = false;
            })
        )
        .subscribe(data => {
          this.vehicleJournalDtos = data;
          this.grid?.refresh();
          this.changeDetectorRef.detectChanges(); // Manually trigger change detection
        });
  }

  // loadData() {
  //   this.isLoadingResults = true;
  //   console.log(`loadData - parentVehicleId: year=${this.parentStartYear}, month=${this.parentEndMonth}, vehicleId=${this.parentVehicleId}`);
  //   this.dataSource?.getVehicleJournalFromMonthYear(this.parentVehicleId, this.parentEndMonth, this.parentStartYear)
  //     .pipe(
  //       map((data: vehicleJournalDtoApi) => {
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = false;
  //         return data.vehicleJournalDtos || [];
  //       }),
  //       catchError(() => {
  //         this.isLoadingResults = false;
  //         return observableOf([]);
  //       })
  //     ).subscribe(data => this.vehicleJournalDtos = data as vehicleJournalDtoApi[]);
  // }

  ngAfterViewInit(): void {
    this.loadData();
  }
}
