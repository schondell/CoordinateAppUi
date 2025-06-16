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
import { NetworkOperator, NetworkOperatorCreateRequest, NetworkOperatorUpdateRequest } from '../../../models/networkoperator.model';
import { NetworkOperatorService } from '../../../services/networkoperator.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';

@Component({
  selector: 'app-networkoperators',
  templateUrl: './networkoperators.component.html',
  styleUrls: ['./networkoperators.component.scss'],
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
export class NetworkOperatorsComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public networkOperators: NetworkOperator[] = [];
  public loading = false;
  public selectedNetworkOperator: NetworkOperator | null = null;
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
    fields: ['name', 'email', 'phone', 'contact', 'vatNo', 'apn'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private networkOperatorService: NetworkOperatorService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadNetworkOperators();
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
        headerText: this.translationService.getTranslation('networkOperators.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'email',
        headerText: this.translationService.getTranslation('networkOperators.fields.Email'),
        width: 200,
        validationRules: { required: true, email: true },
        type: 'string'
      },
      {
        field: 'phone',
        headerText: this.translationService.getTranslation('networkOperators.fields.Phone'),
        width: 130,
        type: 'string'
      },
      {
        field: 'contact',
        headerText: this.translationService.getTranslation('networkOperators.fields.Contact'),
        width: 150,
        type: 'string'
      },
      {
        field: 'vatNo',
        headerText: this.translationService.getTranslation('networkOperators.fields.VatNo'),
        width: 120,
        type: 'string'
      },
      {
        field: 'apn',
        headerText: this.translationService.getTranslation('networkOperators.fields.Apn'),
        width: 120,
        type: 'string'
      },
      {
        field: 'webUrl',
        headerText: this.translationService.getTranslation('networkOperators.fields.WebUrl'),
        width: 150,
        type: 'string'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('networkOperators.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm'
      },
      {
        headerText: this.translationService.getTranslation('networkOperators.fields.Actions'),
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
    this.networkOperatorService.networkOperators$
      .pipe(takeUntil(this.destroy$))
      .subscribe(networkOperators => {
        this.networkOperators = networkOperators;
      });

    this.networkOperatorService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.networkOperatorService.selectedNetworkOperator$
      .pipe(takeUntil(this.destroy$))
      .subscribe(networkOperator => {
        this.selectedNetworkOperator = networkOperator;
      });
  }

  private loadNetworkOperators(): void {
    this.networkOperatorService.loadAllNetworkOperators().subscribe({
      next: () => {
        console.log('Network operators loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedNetworkOperator = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedNetworkOperator = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createNetworkOperator(args.data);
      } else if (args.action === 'edit') {
        this.updateNetworkOperator(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteNetworkOperator(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedNetworkOperator = args.rowData as NetworkOperator;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('networkOperators.messages.DeleteConfirm'))) {
        this.deleteNetworkOperator(args.rowData as NetworkOperator);
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

  private createNetworkOperator(networkOperatorData: any): void {
    const createRequest: NetworkOperatorCreateRequest = {
      name: networkOperatorData.name,
      email: networkOperatorData.email,
      phone: networkOperatorData.phone,
      contact: networkOperatorData.contact,
      vatNo: networkOperatorData.vatNo,
      apn: networkOperatorData.apn,
      webUrl: networkOperatorData.webUrl
    };

    this.networkOperatorService.createNetworkOperator(createRequest).subscribe({
      next: (networkOperator) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateNetworkOperator(networkOperatorData: any): void {
    const updateRequest: NetworkOperatorUpdateRequest = {
      id: networkOperatorData.id,
      name: networkOperatorData.name,
      email: networkOperatorData.email,
      phone: networkOperatorData.phone,
      contact: networkOperatorData.contact,
      vatNo: networkOperatorData.vatNo,
      apn: networkOperatorData.apn,
      webUrl: networkOperatorData.webUrl
    };

    this.networkOperatorService.updateNetworkOperator(networkOperatorData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteNetworkOperator(networkOperator: NetworkOperator): void {
    this.networkOperatorService.deleteNetworkOperator(networkOperator.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('networkOperators.messages.DeleteError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  refreshData(): void {
    this.loadNetworkOperators();
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