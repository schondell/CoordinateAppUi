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
import { Address, AddressCreateRequest, AddressUpdateRequest } from '../../../models/address.model';
import { AddressService } from '../../../services/address.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
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
export class AddressesComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  private destroy$ = new Subject<void>();

  public dataManager!: DataManager;
  public loading = false;
  public selectedAddress: Address | null = null;
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
    fields: ['name', 'address1', 'address2', 'city', 'state', 'country', 'zip'],
    operator: 'contains',
    key: '',
    ignoreCase: true
  };

  public columns: any[] = [];

  constructor(
    private addressService: AddressService,
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
        headerText: this.translationService.getTranslation('addresses.fields.Name'),
        width: 150,
        isPrimaryKey: false,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'address1',
        headerText: this.translationService.getTranslation('addresses.fields.Address1'),
        width: 200,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'address2',
        headerText: this.translationService.getTranslation('addresses.fields.Address2'),
        width: 150,
        type: 'string'
      },
      {
        field: 'city',
        headerText: this.translationService.getTranslation('addresses.fields.City'),
        width: 120,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'state',
        headerText: this.translationService.getTranslation('addresses.fields.State'),
        width: 100,
        type: 'string'
      },
      {
        field: 'zip',
        headerText: this.translationService.getTranslation('addresses.fields.Zip'),
        width: 100,
        validationRules: { required: true },
        type: 'string'
      },
      {
        field: 'country',
        headerText: this.translationService.getTranslation('addresses.fields.Country'),
        width: 120,
        type: 'string'
      },
      {
        field: 'longitude',
        headerText: this.translationService.getTranslation('addresses.fields.Longitude'),
        width: 110,
        type: 'number',
        format: 'N6'
      },
      {
        field: 'latitude',
        headerText: this.translationService.getTranslation('addresses.fields.Latitude'),
        width: 110,
        type: 'number',
        format: 'N6'
      },
      {
        field: 'description',
        headerText: this.translationService.getTranslation('addresses.fields.Description'),
        width: 200,
        type: 'string'
      },
      {
        field: 'created',
        headerText: this.translationService.getTranslation('addresses.fields.Created'),
        width: 140,
        type: 'datetime',
        format: 'dd/MM/yyyy HH:mm',
        allowEditing: false
      },
      {
        headerText: this.translationService.getTranslation('addresses.fields.Actions'),
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
      url: `${baseUrl}/api/Address/UrlDatasource`,
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
    this.addressService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.addressService.selectedAddress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(address => {
        this.selectedAddress = address;
      });
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'add') {
      this.isEditing = false;
      this.selectedAddress = null;
    } else if (args.requestType === 'beginEdit') {
      this.isEditing = true;
      this.selectedAddress = args.rowData;
    } else if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.createAddress(args.data);
      } else if (args.action === 'edit') {
        this.updateAddress(args.data);
      }
    } else if (args.requestType === 'delete') {
      this.deleteAddress(args.data[0]);
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn?.type === 'Edit') {
      this.isEditing = true;
      this.selectedAddress = args.rowData as Address;
      this.grid.startEdit();
    } else if (args.commandColumn?.type === 'Delete') {
      if (confirm(this.translationService.getTranslation('addresses.messages.DeleteConfirm'))) {
        this.deleteAddress(args.rowData as Address);
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

  private createAddress(addressData: any): void {
    const createRequest: AddressCreateRequest = {
      name: addressData.name,
      address1: addressData.address1,
      address2: addressData.address2,
      address3: addressData.address3,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      country: addressData.country,
      longitude: addressData.longitude,
      latitude: addressData.latitude,
      description: addressData.description,
      timeZone: addressData.timeZone,
      comment: addressData.comment
    };

    this.addressService.createAddress(createRequest).subscribe({
      next: (address) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.CreateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.CreateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private updateAddress(addressData: any): void {
    const updateRequest: AddressUpdateRequest = {
      id: addressData.id,
      name: addressData.name,
      address1: addressData.address1,
      address2: addressData.address2,
      address3: addressData.address3,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      country: addressData.country,
      longitude: addressData.longitude,
      latitude: addressData.latitude,
      description: addressData.description,
      timeZone: addressData.timeZone,
      comment: addressData.comment
    };

    this.addressService.updateAddress(addressData.id, updateRequest).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.UpdateSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.UpdateError'),
          error.message,
          MessageSeverity.error
        );
      }
    });
  }

  private deleteAddress(address: Address): void {
    this.addressService.deleteAddress(address.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.DeleteSuccess'),
          '',
          MessageSeverity.success
        );
        this.grid.refresh();
      },
      error: (error) => {
        this.alertService.showMessage(
          this.translationService.getTranslation('addresses.messages.DeleteError'),
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