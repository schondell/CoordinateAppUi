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
import { Vehicle, VehicleCreateRequest, VehicleUpdateRequest } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
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
export class VehiclesComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public vehicles: Vehicle[] = [];
  public loading = false;
  public selectedVehicle: Vehicle | null = null;
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
    fields: ['name', 'licensePlateNumber', 'vin', 'make', 'model'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadVehicles();
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
        headerText: this.translationService.getTranslation('vehicles.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'licensePlateNumber',
        headerText: this.translationService.getTranslation('vehicles.fields.LicensePlateNumber'),
        width: 160,
        type: 'string'
      },
      {
        field: 'vin',
        headerText: this.translationService.getTranslation('vehicles.fields.VIN'),
        width: 180,
        type: 'string'
      },
      {
        field: 'make',
        headerText: this.translationService.getTranslation('vehicles.fields.Make'),
        width: 120,
        type: 'string'
      },
      {
        field: 'model',
        headerText: this.translationService.getTranslation('vehicles.fields.Model'),
        width: 120,
        type: 'string'
      },
      {
        field: 'vehicleYear',
        headerText: this.translationService.getTranslation('vehicles.fields.VehicleYear'),
        width: 100,
        type: 'number'
      },
      {
        field: 'isActive',
        headerText: this.translationService.getTranslation('vehicles.fields.IsActive'),
        width: 100,
        type: 'boolean',
        displayAsCheckBox: true
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('vehicles.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        headerText: this.translationService.getTranslation('vehicles.fields.Actions'),
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
    this.vehicleService.vehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicles => {
        this.vehicles = vehicles;
      });

    this.vehicleService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.vehicleService.selectedVehicle$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicle => {
        this.selectedVehicle = vehicle;
      });
  }

  private loadVehicles(): void {
    this.vehicleService.loadAllVehicles().subscribe({
      next: () => {
        console.log('Vehicles loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedVehicle = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedVehicle = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createVehicle(args.data);
      } else if (args.action === 'edit') {
        this.updateVehicle(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteVehicle(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedVehicle = args.rowData as Vehicle;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('vehicles.messages.DeleteConfirm'))) {
        this.deleteVehicle(args.rowData as Vehicle);
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

  private createVehicle(vehicleData: any): void {
    const createRequest: VehicleCreateRequest = {
      name: vehicleData.name,
      licensePlateNumber: vehicleData.licensePlateNumber,
      vin: vehicleData.vin,
      make: vehicleData.make,
      model: vehicleData.model,
      vehicleYear: vehicleData.vehicleYear,
      isActive: vehicleData.isActive !== undefined ? vehicleData.isActive : true
    };

    this.vehicleService.createVehicle(createRequest).subscribe({
      next: (vehicle) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateVehicle(vehicleData: any): void {
    const updateRequest: VehicleUpdateRequest = {
      id: vehicleData.id,
      name: vehicleData.name,
      licensePlateNumber: vehicleData.licensePlateNumber,
      vin: vehicleData.vin,
      make: vehicleData.make,
      model: vehicleData.model,
      vehicleYear: vehicleData.vehicleYear,
      isActive: vehicleData.isActive
    };

    this.vehicleService.updateVehicle(vehicleData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteVehicle(vehicle: Vehicle): void {
    this.vehicleService.deleteVehicle(vehicle.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('vehicles.messages.DeleteError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  refreshData(): void {
    this.loadVehicles();
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