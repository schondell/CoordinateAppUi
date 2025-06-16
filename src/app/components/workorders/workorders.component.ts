import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent, GridModule, EditService, ToolbarService, PageService, SortService, FilterService, SearchService, ExcelExportService, PdfExportService, CommandClickEventArgs, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderUpdateRequest, WorkOrderStatus, WorkOrderPriority } from '../../models/workorder.model';
import { WorkOrderService } from '../../services/workorder.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';

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
    PageHeaderComponent
  ]
})
export class WorkOrdersComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public workOrders: WorkOrder[] = [];
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
    columns: [{ field: 'orderNumber', direction: 'Ascending' }]
  };

  public searchSettings = {
    fields: ['orderNumber', 'title', 'customerName', 'status', 'priority'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  // Dropdown options
  public statusOptions = [
    { text: 'Draft', value: WorkOrderStatus.Draft },
    { text: 'Pending', value: WorkOrderStatus.Pending },
    { text: 'Assigned', value: WorkOrderStatus.Assigned },
    { text: 'In Progress', value: WorkOrderStatus.InProgress },
    { text: 'On Hold', value: WorkOrderStatus.OnHold },
    { text: 'Completed', value: WorkOrderStatus.Completed },
    { text: 'Cancelled', value: WorkOrderStatus.Cancelled }
  ];

  public priorityOptions = [
    { text: 'Low', value: WorkOrderPriority.Low },
    { text: 'Medium', value: WorkOrderPriority.Medium },
    { text: 'High', value: WorkOrderPriority.High },
    { text: 'Critical', value: WorkOrderPriority.Critical }
  ];

  public customerOptions: any[] = [];
  public vehicleOptions: any[] = [];

  constructor(
    private workOrderService: WorkOrderService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadWorkOrders();
    this.setupSubscriptions();
    this.loadDropdownData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumns(): void {
    this.columns = [
      {
        field: 'orderNumber',
        headerText: this.translationService.getTranslation('workOrders.fields.OrderNumber'),
        width: 140,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'title',
        headerText: this.translationService.getTranslation('workOrders.fields.Title'),
        width: 200,
        type: 'string'
      },
      {
        field: 'customerName',
        headerText: this.translationService.getTranslation('workOrders.fields.Customer'),
        width: 150,
        type: 'string'
      },
      {
        field: 'vehicleRegistration',
        headerText: this.translationService.getTranslation('workOrders.fields.Vehicle'),
        width: 120,
        type: 'string'
      },
      {
        field: 'status',
        headerText: this.translationService.getTranslation('workOrders.fields.Status'),
        width: 100,
        type: 'string',
        template: '<div class="status-badge status-${status.toLowerCase()}">${status}</div>'
      },
      {
        field: 'priority',
        headerText: this.translationService.getTranslation('workOrders.fields.Priority'),
        width: 100,
        type: 'string',
        template: '<div class="priority-badge priority-${priority.toLowerCase()}">${priority}</div>'
      },
      {
        field: 'estimatedHours',
        headerText: this.translationService.getTranslation('workOrders.fields.EstimatedHours'),
        width: 120,
        type: 'number',
        format: 'n1'
      },
      {
        field: 'estimatedCost',
        headerText: this.translationService.getTranslation('workOrders.fields.EstimatedCost'),
        width: 120,
        type: 'number',
        format: 'c2'
      },
      {
        field: 'scheduledDate',
        headerText: this.translationService.getTranslation('workOrders.fields.ScheduledDate'),
        width: 130,
        type: 'date',
        format: 'dd/MM/yyyy'
      },
      {
        field: 'assignedToName',
        headerText: this.translationService.getTranslation('workOrders.fields.AssignedTo'),
        width: 140,
        type: 'string'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('workOrders.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
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

  private setupSubscriptions(): void {
    this.workOrderService.workOrders$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workOrders => {
        this.workOrders = workOrders;
      });

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

  private loadWorkOrders(): void {
    this.workOrderService.loadAllWorkOrders().subscribe({
      next: () => {
        console.log('Work orders loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('workOrders.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private loadDropdownData(): void {
    // TODO: Load customers and vehicles for dropdown options
    // This would typically come from customer and vehicle services
    this.customerOptions = [
      { text: 'Select Customer', value: null }
    ];

    this.vehicleOptions = [
      { text: 'Select Vehicle', value: null }
    ];
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedWorkOrder = {
        orderNumber: this.generateOrderNumber(),
        status: WorkOrderStatus.Draft,
        priority: WorkOrderPriority.Medium
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

  private generateOrderNumber(): string {
    const prefix = 'WO';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }

  private createWorkOrder(workOrderData: any): void {
    const createRequest: WorkOrderCreateRequest = {
      orderNumber: workOrderData.orderNumber,
      title: workOrderData.title,
      description: workOrderData.description,
      customerId: workOrderData.customerId,
      vehicleId: workOrderData.vehicleId,
      assignedTo: workOrderData.assignedTo,
      status: workOrderData.status,
      priority: workOrderData.priority,
      estimatedHours: workOrderData.estimatedHours,
      estimatedCost: workOrderData.estimatedCost,
      scheduledDate: workOrderData.scheduledDate,
      location: workOrderData.location,
      notes: workOrderData.notes
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
      orderNumber: workOrderData.orderNumber,
      title: workOrderData.title,
      description: workOrderData.description,
      customerId: workOrderData.customerId,
      vehicleId: workOrderData.vehicleId,
      assignedTo: workOrderData.assignedTo,
      status: workOrderData.status,
      priority: workOrderData.priority,
      estimatedHours: workOrderData.estimatedHours,
      actualHours: workOrderData.actualHours,
      estimatedCost: workOrderData.estimatedCost,
      actualCost: workOrderData.actualCost,
      scheduledDate: workOrderData.scheduledDate,
      startDate: workOrderData.startDate,
      completedDate: workOrderData.completedDate,
      location: workOrderData.location,
      notes: workOrderData.notes
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
    this.loadWorkOrders();
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