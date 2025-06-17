import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent, GridModule, EditService, ToolbarService, PageService, SortService, FilterService, SearchService, ExcelExportService, PdfExportService, CommandClickEventArgs, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest } from '../../models/workorder.model';
import { WorkOrderService } from '../../services/workorder.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-workorders',
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss'],
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
    NumericTextBoxModule,
    DatePickerModule,
    DateTimePickerModule,
    PageHeaderComponent
  ]
})
export class WorkOrdersComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public dataManager!: DataManager;
  public loading = false;
  public selectedWorkOrder: any = {};
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
    columns: [{ field: 'title', direction: 'Ascending' }]
  };

  public searchSettings = {
    fields: ['title', 'description'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];


  constructor(
    private workOrderService: WorkOrderService,
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
        field: 'title',
        headerText: this.translationService.getTranslation('workOrders.fields.Title'),
        width: 200,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'description',
        headerText: this.translationService.getTranslation('workOrders.fields.Description'),
        width: 250,
        type: 'string'
      },
      {
        field: 'started',
        headerText: this.translationService.getTranslation('workOrders.fields.Started'),
        width: 150,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        field: 'ended',
        headerText: this.translationService.getTranslation('workOrders.fields.Ended'),
        width: 150,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('workOrders.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm',
        allowEditing: false
      },
      {
        headerText: this.translationService.getTranslation('workOrders.fields.Actions'),
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
    this.dataManager = new DataManager({
      url: `${baseUrl}/api/WorkOrder/UrlDatasource`,
      adaptor: new UrlAdaptor(),
      headers: [
        { 'Authorization': `Bearer ${this.authService.accessToken}` },
        { 'Content-Type': 'application/json' },
        { 'Accept': 'application/json, text/plain, */*' }
      ],
      crossDomain: true
    });
  }

  private setupSubscriptions(): void {
    this.workOrderService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.workOrderService.selectedWorkOrder$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workOrder => {
        if (workOrder) {
          this.selectedWorkOrder = { ...workOrder };
        }
      });
  }



  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedWorkOrder = {
        title: '',
        description: ''
      };
      this.showDialog = true;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedWorkOrder = { ...args.rowData };
      this.showDialog = true;
    } else if (args.requestType === 'delete') {
      this.deleteWorkOrder(args.data[0]);
    }
    
    // Cancel default grid dialog
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      args.cancel = true;
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedWorkOrder = { ...args.rowData as WorkOrder };
      this.showDialog = true;
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('workOrders.messages.DeleteConfirm'))) {
        this.deleteWorkOrder(args.rowData as WorkOrder);
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
      case 'grid_add':
        this.onActionBegin({ requestType: 'add' });
        break;
    }
  }

  onSearch(event: any): void {
    const searchValue = event.target.value;
    if (this.grid) {
      this.grid.search(searchValue);
    }
  }

  onDialogClose(): void {
    this.showDialog = false;
    this.selectedWorkOrder = {};
    this.isEditing = false;
  }

  onSaveWorkOrder(): void {
    if (this.isEditing) {
      this.updateWorkOrder(this.selectedWorkOrder);
    } else {
      this.createWorkOrder(this.selectedWorkOrder);
    }
  }

  private createWorkOrder(workOrderData: any): void {
    const createRequest: WorkOrderCreateRequest = {
      title: workOrderData.title,
      description: workOrderData.description,
      started: workOrderData.started,
      ended: workOrderData.ended
    };

    this.workOrderService.createWorkOrder(createRequest).subscribe({
      next: (workOrder) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.onDialogClose();
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateWorkOrder(workOrderData: any): void {
    const updateRequest: WorkOrderUpdateRequest = {
      id: workOrderData.id,
      title: workOrderData.title,
      description: workOrderData.description,
      started: workOrderData.started,
      ended: workOrderData.ended
    };

    this.workOrderService.updateWorkOrder(workOrderData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.onDialogClose();
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteWorkOrder(workOrder: WorkOrder): void {
    this.workOrderService.deleteWorkOrder(workOrder.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.DeleteError'),
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

  // Method to refresh grid on layout changes
  refreshGridLayout(): void {
    if (this.grid) {
      // Trigger grid refresh for responsive behavior
      setTimeout(() => {
        this.grid.refresh();
      }, 350); // Wait for sidebar animation to complete
    }
  }
}