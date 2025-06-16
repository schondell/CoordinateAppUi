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
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
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
export class CustomersComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public customers: Customer[] = [];
  public loading = false;
  public selectedCustomer: Customer | null = null;
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
    columns: [{ field: 'email', direction: 'Ascending' }]
  };

  public searchSettings = {
    fields: ['email', 'contact', 'companyNo', 'phone'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadCustomers();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumns(): void {
    this.columns = [
      {
        field: 'email',
        headerText: this.translationService.getTranslation('customers.fields.Email'),
        width: 200,
        isPrimaryKey: false,
        validationRules: { required: true, email: true },
        type: 'string'
      },
      {
        field: 'contact',
        headerText: this.translationService.getTranslation('customers.fields.Contact'),
        width: 150,
        type: 'string'
      },
      {
        field: 'phone',
        headerText: this.translationService.getTranslation('customers.fields.Phone'),
        width: 130,
        type: 'string'
      },
      {
        field: 'companyNo',
        headerText: this.translationService.getTranslation('customers.fields.CompanyNo'),
        width: 130,
        type: 'string'
      },
      {
        field: 'webUrl',
        headerText: this.translationService.getTranslation('customers.fields.WebUrl'),
        width: 150,
        type: 'string'
      },
      {
        field: 'vatNo',
        headerText: this.translationService.getTranslation('customers.fields.VatNo'),
        width: 120,
        type: 'string'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('customers.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        headerText: this.translationService.getTranslation('customers.fields.Actions'),
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
    this.customerService.customers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customers => {
        this.customers = customers;
      });

    this.customerService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.customerService.selectedCustomer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        this.selectedCustomer = customer;
      });
  }

  private loadCustomers(): void {
    this.customerService.loadAllCustomers().subscribe({
      next: () => {
        console.log('Customers loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedCustomer = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedCustomer = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createCustomer(args.data);
      } else if (args.action === 'edit') {
        this.updateCustomer(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteCustomer(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedCustomer = args.rowData as Customer;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('customers.messages.DeleteConfirm'))) {
        this.deleteCustomer(args.rowData as Customer);
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

  private createCustomer(customerData: any): void {
    const createRequest: CustomerCreateRequest = {
      name: customerData.email, // Using email as name for now
      email: customerData.email,
      phone: customerData.phone,
      contact: customerData.contact,
      webUrl: customerData.webUrl,
      vatNo: customerData.vatNo,
      companyNo: customerData.companyNo,
      parentCustomer: 0 // Default value
    };

    this.customerService.createCustomer(createRequest).subscribe({
      next: (customer) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateCustomer(customerData: any): void {
    const updateRequest: CustomerUpdateRequest = {
      id: customerData.id,
      name: customerData.email, // Using email as name for now
      email: customerData.email,
      phone: customerData.phone,
      contact: customerData.contact,
      webUrl: customerData.webUrl,
      vatNo: customerData.vatNo,
      companyNo: customerData.companyNo,
      parentCustomer: customerData.parentCustomer || 0
    };

    this.customerService.updateCustomer(customerData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteCustomer(customer: Customer): void {
    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('customers.messages.DeleteError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  refreshData(): void {
    this.loadCustomers();
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
