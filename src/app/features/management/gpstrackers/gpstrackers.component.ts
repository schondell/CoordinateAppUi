import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent, GridModule, EditService, ToolbarService, PageService, SortService, FilterService, SearchService, ExcelExportService, PdfExportService, CommandClickEventArgs, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { GpsTracker, GpsTrackerCreateRequest, GpsTrackerUpdateRequest } from '../../../models/gpstracker.model';
import { GpsTrackerService } from '../../../services/gpstracker.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';

@Component({
  selector: 'app-gpstrackers',
  templateUrl: './gpstrackers.component.html',
  styleUrls: ['./gpstrackers.component.scss'],
  animations: [fadeInOut],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    FilterService,
    SearchService,
    ExcelExportService,
    PdfExportService,
    CommandColumnService
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    GridModule,
    DropDownListModule,
    DialogModule,
    ButtonModule,
    TextBoxModule,
    PageHeaderComponent
  ]
})
export class GpsTrackersComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public gpsTrackers: GpsTracker[] = [];
  public loading = false;
  public selectedGpsTracker: GpsTracker | null = null;
  public isEditing = false;
  public showDialog = false;
  
  public editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    template: ''
  };

  public toolbar = [
    'Add',
    'Edit',
    'Delete',
    'Update',
    'Cancel',
    'ExcelExport',
    'PdfExport',
    'Search'
  ];

  public pageSettings = {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    currentPage: 1
  };

  public filterSettings = {
    type: 'Excel'
  };

  public sortSettings = {
    columns: [{ field: 'name', direction: 'Ascending' }]
  };

  public searchSettings = {
    fields: ['name', 'trackerIdentification', 'imeNumber', 'trackerPassword'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private gpsTrackerService: GpsTrackerService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadGpsTrackers();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumns(): void {
    this.columns = [
      {
        field: 'name',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'trackerIdentification',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.TrackerIdentification'),
        width: 200,
        type: 'string'
      },
      {
        field: 'imeNumber',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.ImeNumber'),
        width: 180,
        type: 'string'
      },
      {
        field: 'trackerPassword',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.TrackerPassword'),
        width: 150,
        type: 'string'
      },
      {
        field: 'isActive',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.IsActive'),
        width: 100,
        type: 'boolean',
        displayAsCheckBox: true
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('gpsTrackers.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        headerText: this.translationService.getTranslation('gpsTrackers.fields.Actions'),
        width: 120,
        commands: [
          {
            type: 'Edit',
            buttonOption: {
              iconCss: 'e-icons e-edit',
              cssClass: 'e-flat'
            }
          },
          {
            type: 'Delete',
            buttonOption: {
              iconCss: 'e-icons e-delete',
              cssClass: 'e-flat'
            }
          }
        ]
      }
    ];
  }

  private setupSubscriptions(): void {
    this.gpsTrackerService.gpsTrackers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gpsTrackers => {
        this.gpsTrackers = gpsTrackers;
      });

    this.gpsTrackerService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.gpsTrackerService.selectedGpsTracker$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gpsTracker => {
        this.selectedGpsTracker = gpsTracker;
      });
  }

  private loadGpsTrackers(): void {
    this.gpsTrackerService.loadAllGpsTrackers().subscribe({
      next: () => {
        console.log('GPS trackers loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedGpsTracker = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedGpsTracker = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createGpsTracker(args.data);
      } else if (args.action === 'edit') {
        this.updateGpsTracker(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteGpsTracker(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedGpsTracker = args.rowData as GpsTracker;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('gpsTrackers.messages.DeleteConfirm'))) {
        this.deleteGpsTracker(args.rowData as GpsTracker);
      }
    }
  }

  onToolbarClick(args: any): void {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport();
        break;
      case 'grid_pdfexport':
        this.grid.pdfExport();
        break;
    }
  }

  private createGpsTracker(gpsTrackerData: any): void {
    const createRequest: GpsTrackerCreateRequest = {
      name: gpsTrackerData.name,
      trackerIdentification: gpsTrackerData.trackerIdentification,
      imeNumber: gpsTrackerData.imeNumber,
      trackerPassword: gpsTrackerData.trackerPassword,
      isActive: gpsTrackerData.isActive !== undefined ? gpsTrackerData.isActive : true
    };

    this.gpsTrackerService.createGpsTracker(createRequest).subscribe({
      next: (gpsTracker) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateGpsTracker(gpsTrackerData: any): void {
    const updateRequest: GpsTrackerUpdateRequest = {
      id: gpsTrackerData.id,
      name: gpsTrackerData.name,
      trackerIdentification: gpsTrackerData.trackerIdentification,
      imeNumber: gpsTrackerData.imeNumber,
      trackerPassword: gpsTrackerData.trackerPassword,
      isActive: gpsTrackerData.isActive
    };

    this.gpsTrackerService.updateGpsTracker(gpsTrackerData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteGpsTracker(gpsTracker: GpsTracker): void {
    this.gpsTrackerService.deleteGpsTracker(gpsTracker.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('gpsTrackers.messages.DeleteError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  refreshData(): void {
    this.loadGpsTrackers();
  }

  exportToExcel(): void {
    this.grid.excelExport();
  }

  exportToPdf(): void {
    this.grid.pdfExport();
  }

  refreshGridLayout(): void {
    if (this.grid) {
      setTimeout(() => {
        this.grid.refresh();
      }, 350);
    }
  }
}