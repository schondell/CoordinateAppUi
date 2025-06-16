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
import { SimCard, SimCardCreateRequest, SimCardUpdateRequest } from '../../../models/simcard.model';
import { SimCardService } from '../../../services/simcard.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';

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
export class SimCardsComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public simCards: SimCard[] = [];
  public loading = false;
  public selectedSimCard: SimCard | null = null;
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
    fields: ['name', 'iccid', 'imsi', 'mobileNumber', 'description'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private simCardService: SimCardService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadSimCards();
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
        headerText: this.translationService.getTranslation('simCards.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
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
        format: 'dd/MM/yyyy HH:mm'
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

  private setupSubscriptions(): void {
    this.simCardService.simCards$
      .pipe(takeUntil(this.destroy$))
      .subscribe(simCards => {
        this.simCards = simCards;
      });

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

  private loadSimCards(): void {
    this.simCardService.loadAllSimCards().subscribe({
      next: () => {
        console.log('SIM cards loaded successfully');
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('simCards.messages.LoadError'),
          error.message,
          MessageSeverity.error
        );
      }
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
      iccid: simCardData.iccid,
      imsi: simCardData.imsi,
      mobileNumber: simCardData.mobileNumber,
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
    const updateRequest: SimCardUpdateRequest = {
      id: simCardData.id,
      name: simCardData.name,
      iccid: simCardData.iccid,
      imsi: simCardData.imsi,
      mobileNumber: simCardData.mobileNumber,
      description: simCardData.description,
      isActive: simCardData.isActive
    };

    this.simCardService.updateSimCard(simCardData.id, updateRequest).subscribe({
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
    this.simCardService.deleteSimCard(simCard.id).subscribe({
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
    this.loadSimCards();
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