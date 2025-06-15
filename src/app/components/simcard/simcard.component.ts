import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, PageSettingsModel, GridModule, SortService, PageService, FilterService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';

import { fadeInOut } from '../../services/animations';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { ISimCardDto, ISimCardDtoApi } from '../../models/generatedtypes';
import { SimCardRepository } from '../../services/generated/simcard-repository';

@Component({
  selector: 'app-simcard',
  templateUrl: './simcard.component.html',
  styleUrls: ['./simcard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    TextBoxModule,
    DialogModule,
    TranslateModule,
    PageHeaderComponent
  ],
  providers: [SortService, PageService, FilterService],
  animations: [fadeInOut]
})
export class SimCardComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;

  dataSource: ISimCardDto[] = [];
  loadingIndicator: boolean;
  totalCount: number = 0;
  
  pageSettings: PageSettingsModel = {
    pageSize: 10,
    pageSizes: [5, 10, 20, 50],
    enableQueryString: false
  };

  constructor(
    private simCardRepository: SimCardRepository,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingIndicator = true;
    
    this.simCardRepository.getAllSimCards('', 'simCardId', 'asc', 0, this.pageSettings.pageSize)
      .subscribe({
        next: (result: ISimCardDtoApi) => {
          this.dataSource = result.simCardDtos || [];
          this.totalCount = result.totalCount || 0;
          this.loadingIndicator = false;
        },
        error: (error) => {
          this.loadingIndicator = false;
          this.alertService.showMessage('Load Error', `Unable to retrieve sim cards from the server.\r\nErrors: "${error}"`, MessageSeverity.error);
        }
      });
  }

  onPageChange(args: any) {
    if (args.currentPage !== undefined) {
      const page = args.currentPage - 1; // Syncfusion uses 1-based pages, backend uses 0-based
      const pageSize = args.pageSize || this.pageSettings.pageSize;
      
      this.loadingIndicator = true;
      this.simCardRepository.getAllSimCards('', 'simCardId', 'asc', page, pageSize)
        .subscribe({
          next: (result: ISimCardDtoApi) => {
            this.dataSource = result.simCardDtos || [];
            this.totalCount = result.totalCount || 0;
            this.loadingIndicator = false;
          },
          error: (error) => {
            this.loadingIndicator = false;
            this.alertService.showMessage('Load Error', `Unable to retrieve sim cards from the server.\r\nErrors: "${error}"`, MessageSeverity.error);
          }
        });
    }
  }

  onSort(args: any) {
    if (args.columnName && args.direction) {
      this.loadingIndicator = true;
      this.simCardRepository.getAllSimCards('', args.columnName, args.direction.toLowerCase(), 0, this.pageSettings.pageSize)
        .subscribe({
          next: (result: ISimCardDtoApi) => {
            this.dataSource = result.simCardDtos || [];
            this.totalCount = result.totalCount || 0;
            this.loadingIndicator = false;
          },
          error: (error) => {
            this.loadingIndicator = false;
            this.alertService.showMessage('Load Error', `Unable to retrieve sim cards from the server.\r\nErrors: "${error}"`, MessageSeverity.error);
          }
        });
    }
  }

  refresh() {
    this.loadData();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  formatBoolean(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}