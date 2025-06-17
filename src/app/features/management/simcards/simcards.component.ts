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
import { SimCard, SimCardCreateRequest, SimCardUpdateRequest } from '../../../models/simcard.model';
import { SimCardService } from '../../../services/simcard.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ReferenceDataService } from '../../../services/reference-data.service';
import { NetworkOperator } from '../../../models/networkoperator.model';
import { ConfigurationService } from '../../../services/configuration.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-simcards',
  templateUrl: './simcards.component.html',
  styleUrls: ['./simcards.component.scss'],
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
export class SimCardsComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public dataManager!: DataManager;
  public loading = false;
  public selectedSimCard: SimCard | null = null;
  public isEditing = false;
  public showDialog = false;
  public networkOperators: NetworkOperator[] = [];
  
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
    fields: ['name', 'iccid', 'imsi', 'mobileNumber', 'description'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private simCardService: SimCardService,
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private referenceDataService: ReferenceDataService,
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReferenceData();
    this.initializeColumns();
    this.initializeDataManager();
    this.testBackendEndpoint(); // Debug endpoint
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadReferenceData(): void {
    console.log('Loading NetworkOperators...');
    this.referenceDataService.getNetworkOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe(operators => {
        console.log('NetworkOperators loaded:', operators.length, operators);
        this.networkOperators = operators;
      });
  }

  private initializeColumns(): void {
    this.columns = [
      {
        field: 'simCardId',
        headerText: this.translationService.getTranslation('common.fields.ID'),
        width: 80,
        isPrimaryKey: true,
        type: 'number',
        allowEditing: false
      },
      {
        field: 'id',
        headerText: 'Legacy ID',
        width: 80,
        type: 'number',
        visible: false,
        allowEditing: false
      },
      {
        field: 'name',
        headerText: this.translationService.getTranslation('simCards.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'networkOperatorId',
        headerText: this.translationService.getTranslation('simCards.fields.NetworkOperator'),
        width: 180,
        type: 'number'
      },
      {
        field: 'iccid',
        headerText: this.translationService.getTranslation('simCards.fields.ICCID'),
        width: 200,
        type: 'string'
      },
      {
        field: 'imsi',
        headerText: this.translationService.getTranslation('simCards.fields.IMSI'),
        width: 180,
        type: 'string'
      },
      {
        field: 'mobileNumber',
        headerText: this.translationService.getTranslation('simCards.fields.MobileNumber'),
        width: 150,
        type: 'string'
      },
      {
        field: 'puk',
        headerText: this.translationService.getTranslation('simCards.fields.PUK'),
        width: 120,
        type: 'string'
      },
      {
        field: 'description',
        headerText: this.translationService.getTranslation('simCards.fields.Description'),
        width: 200,
        type: 'string'
      },
      {
        field: 'isActive',
        headerText: this.translationService.getTranslation('simCards.fields.IsActive'),
        width: 100,
        type: 'boolean',
        displayAsCheckBox: true
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('simCards.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm',
        allowEditing: false
      },
      {
        headerText: this.translationService.getTranslation('simCards.fields.Actions'),
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
    
    console.log('🔧 DataManager Debug Info:', {
      baseUrl: baseUrl,
      endpoint: `${baseUrl}/api/SimCard/UrlDatasource`,
      hasToken: !!accessToken,
      tokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'none'
    });
    
    // Production-ready DataManager with proper authentication
    const headers: any[] = [];
    if (accessToken) {
      headers.push({ 'Authorization': `Bearer ${accessToken}` });
      headers.push({ 'Content-Type': 'application/json' });
      headers.push({ 'Accept': 'application/json' });
    }
    
    this.dataManager = new DataManager({
      url: `${baseUrl}/api/SimCard/UrlDatasource`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
      headers: headers
    });
    
    // Add error handling
    this.dataManager.dataSource.offline = false;
  }

  private testBackendEndpoint(): void {
    // Test if the endpoint exists and works
    const baseUrl = this.configurationService.baseUrl;
    console.log('🧪 Testing backend endpoint directly...');
    
    // Try the basic endpoint first
    this.simCardService.loadAllSimCards().subscribe({
      next: () => {
        console.log('✅ Basic SimCard endpoint works');
      },
      error: (error) => {
        console.error('❌ Basic SimCard endpoint failed:', error);
      }
    });
    
    // Try the DataManager endpoint directly
    const testRequest = {
      skip: 0,
      take: 20,
      requiresCounts: true,
      sorted: [],
      where: [],
      search: []
    };
    
    this.simCardService.getSimCardsForDataGrid(testRequest).subscribe({
      next: (response) => {
        console.log('✅ UrlDatasource endpoint works:', response);
      },
      error: (error) => {
        console.error('❌ UrlDatasource endpoint failed:', error);
      }
    });
  }

  private setupSubscriptions(): void {
    this.simCardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.simCardService.selectedSimCard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(simCard => {
        this.selectedSimCard = simCard;
      });
  }


  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedSimCard = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedSimCard = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createSimCard(args.data);
      } else if (args.action === 'edit') {
        this.updateSimCard(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteSimCard(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedSimCard = args.rowData as SimCard;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('simCards.messages.DeleteConfirm'))) {
        this.deleteSimCard(args.rowData as SimCard);
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

  private createSimCard(simCardData: any): void {
    const createRequest: SimCardCreateRequest = {
      name: simCardData.name,
      networkOperatorId: simCardData.networkOperatorId,
      iccid: simCardData.iccid,
      imsi: simCardData.imsi,
      mobileNumber: simCardData.mobileNumber,
      puk: simCardData.puk,
      description: simCardData.description,
      isActive: simCardData.isActive !== undefined ? simCardData.isActive : true
    };

    this.simCardService.createSimCard(createRequest).subscribe({
      next: (simCard) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateSimCard(simCardData: any): void {
    const id = simCardData.simCardId || simCardData.id;
    const updateRequest: SimCardUpdateRequest = {
      id: id,
      name: simCardData.name,
      networkOperatorId: simCardData.networkOperatorId,
      iccid: simCardData.iccid,
      imsi: simCardData.imsi,
      mobileNumber: simCardData.mobileNumber,
      puk: simCardData.puk,
      description: simCardData.description,
      isActive: simCardData.isActive
    };

    this.simCardService.updateSimCard(id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteSimCard(simCard: SimCard): void {
    const id = simCard.simCardId || simCard.id;
    this.simCardService.deleteSimCard(id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.DeleteError'),
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