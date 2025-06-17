import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent, GridModule, EditService, ToolbarService, PageService, SortService, FilterService, SearchService, ExcelExportService, PdfExportService, CommandClickEventArgs, CommandColumnService, ResizeService, ColumnMenuService, ColumnChooserService } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { Resource, ResourceCreateRequest, ResourceUpdateRequest } from '../../../models/resource.model';
import { ResourceService } from '../../../services/resource.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
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
    CommandColumnService,
    ResizeService,
    ColumnMenuService,
    ColumnChooserService
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
export class ResourcesComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public dataManager!: DataManager;
  public loading = false;
  public selectedResource: Resource | null = null;
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
    fields: ['name', 'description', 'resourceType', 'category', 'location', 'serialNumber', 'barcode', 'manufacturer', 'model', 'status'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private resourceService: ResourceService,
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeDataManager();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumns(): void {
    this.columns = [
      {
        field: 'id',
        headerText: this.translationService.getTranslation('common.fields.ID'),
        width: 80,
        isPrimaryKey: true,
        type: 'number',
        allowEditing: false
      },
      {
        field: 'name',
        headerText: this.translationService.getTranslation('resources.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'description',
        headerText: this.translationService.getTranslation('resources.fields.Description'),
        width: 200,
        type: 'string'
      },
      {
        field: 'resourceType',
        headerText: this.translationService.getTranslation('resources.fields.ResourceType'),
        width: 130,
        type: 'string'
      },
      {
        field: 'category',
        headerText: this.translationService.getTranslation('resources.fields.Category'),
        width: 120,
        type: 'string'
      },
      {
        field: 'unit',
        headerText: this.translationService.getTranslation('resources.fields.Unit'),
        width: 80,
        type: 'string'
      },
      {
        field: 'unitPrice',
        headerText: this.translationService.getTranslation('resources.fields.UnitPrice'),
        width: 100,
        type: 'number',
        format: 'C2'
      },
      {
        field: 'quantityAvailable',
        headerText: this.translationService.getTranslation('resources.fields.QuantityAvailable'),
        width: 120,
        type: 'number'
      },
      {
        field: 'quantityReserved',
        headerText: this.translationService.getTranslation('resources.fields.QuantityReserved'),
        width: 120,
        type: 'number'
      },
      {
        field: 'location',
        headerText: this.translationService.getTranslation('resources.fields.Location'),
        width: 120,
        type: 'string'
      },
      {
        field: 'serialNumber',
        headerText: this.translationService.getTranslation('resources.fields.SerialNumber'),
        width: 130,
        type: 'string'
      },
      {
        field: 'barcode',
        headerText: this.translationService.getTranslation('resources.fields.Barcode'),
        width: 120,
        type: 'string'
      },
      {
        field: 'manufacturer',
        headerText: this.translationService.getTranslation('resources.fields.Manufacturer'),
        width: 130,
        type: 'string'
      },
      {
        field: 'model',
        headerText: this.translationService.getTranslation('resources.fields.Model'),
        width: 120,
        type: 'string'
      },
      {
        field: 'status',
        headerText: this.translationService.getTranslation('resources.fields.Status'),
        width: 100,
        type: 'string'
      },
      {
        field: 'condition',
        headerText: this.translationService.getTranslation('resources.fields.Condition'),
        width: 100,
        type: 'string'
      },
      {
        field: 'isActive',
        headerText: this.translationService.getTranslation('resources.fields.IsActive'),
        width: 90,
        type: 'boolean',
        displayAsCheckBox: true
      },
      {
        field: 'purchaseDate',
        headerText: this.translationService.getTranslation('resources.fields.PurchaseDate'),
        width: 120,
        type: 'date',
        format: 'dd/MM/yyyy'
      },
      {
        field: 'warrantyExpiry',
        headerText: this.translationService.getTranslation('resources.fields.WarrantyExpiry'),
        width: 130,
        type: 'date',
        format: 'dd/MM/yyyy'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('resources.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm',
        allowEditing: false
      },
      {
        headerText: this.translationService.getTranslation('resources.fields.Actions'),
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

  private initializeDataManager(): void {
    const baseUrl = this.configurationService.baseUrl;
    const accessToken = this.authService.accessToken;
    
    this.dataManager = new DataManager({
      url: `${baseUrl}/api/Resource/UrlDatasource`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
      headers: [
        { 'Authorization': `Bearer ${accessToken}` },
        { 'Content-Type': 'application/json' },
        { 'Accept': 'application/json, text/plain, */*' }
      ]
    });
  }

  private setupSubscriptions(): void {
    this.resourceService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.resourceService.selectedResource$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resource => {
        this.selectedResource = resource;
      });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedResource = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedResource = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createResource(args.data);
      } else if (args.action === 'edit') {
        this.updateResource(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteResource(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedResource = args.rowData as Resource;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('resources.messages.DeleteConfirm'))) {
        this.deleteResource(args.rowData as Resource);
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

  private createResource(resourceData: any): void {
    const createRequest: ResourceCreateRequest = {
      name: resourceData.name,
      description: resourceData.description,
      resourceType: resourceData.resourceType,
      category: resourceData.category,
      unit: resourceData.unit,
      unitPrice: resourceData.unitPrice,
      quantityAvailable: resourceData.quantityAvailable,
      quantityReserved: resourceData.quantityReserved,
      minimumStock: resourceData.minimumStock,
      maximumStock: resourceData.maximumStock,
      location: resourceData.location,
      serialNumber: resourceData.serialNumber,
      barcode: resourceData.barcode,
      manufacturer: resourceData.manufacturer,
      model: resourceData.model,
      specifications: resourceData.specifications,
      purchaseDate: resourceData.purchaseDate,
      warrantyExpiry: resourceData.warrantyExpiry,
      condition: resourceData.condition,
      status: resourceData.status,
      isActive: resourceData.isActive,
      notes: resourceData.notes,
      supplierId: resourceData.supplierId
    };

    this.resourceService.createResource(createRequest).subscribe({
      next: (resource) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateResource(resourceData: any): void {
    const updateRequest: ResourceUpdateRequest = {
      id: resourceData.id,
      name: resourceData.name,
      description: resourceData.description,
      resourceType: resourceData.resourceType,
      category: resourceData.category,
      unit: resourceData.unit,
      unitPrice: resourceData.unitPrice,
      quantityAvailable: resourceData.quantityAvailable,
      quantityReserved: resourceData.quantityReserved,
      minimumStock: resourceData.minimumStock,
      maximumStock: resourceData.maximumStock,
      location: resourceData.location,
      serialNumber: resourceData.serialNumber,
      barcode: resourceData.barcode,
      manufacturer: resourceData.manufacturer,
      model: resourceData.model,
      specifications: resourceData.specifications,
      purchaseDate: resourceData.purchaseDate,
      warrantyExpiry: resourceData.warrantyExpiry,
      condition: resourceData.condition,
      status: resourceData.status,
      isActive: resourceData.isActive,
      notes: resourceData.notes,
      supplierId: resourceData.supplierId
    };

    this.resourceService.updateResource(resourceData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteResource(resource: Resource): void {
    this.resourceService.deleteResource(resource.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('resources.messages.DeleteError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  refreshData(): void {
    if (this.grid) {
      this.grid.refresh();
    }
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