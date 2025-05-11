import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion imports
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';

export interface PageInfo {
  title: string;
  icon: string;
  path: string;
  isDefault: boolean;
}

export interface LanguagePreference {
  name: string;
  locale: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DropDownListModule,
    SwitchModule,
    TooltipModule,
    DialogModule
  ]
})
export class UserPreferencesComponent {
  languages: LanguagePreference[] = [
    { name: 'English', locale: 'en', isDefault: true },
    { name: 'French', locale: 'fr', isDefault: false },
    { name: 'German', locale: 'de', isDefault: false },
    { name: 'Portuguese', locale: 'pt', isDefault: false },
    { name: 'Arabic', locale: 'ar', isDefault: false },
    { name: 'Korean', locale: 'ko', isDefault: false }
  ];

  homePages: PageInfo[] = [
    { title: 'Dashboard', icon: 'dashboard', path: '/', isDefault: true },
    { title: 'Customers', icon: 'contacts', path: '/customers', isDefault: false },
    { title: 'Products', icon: 'local_shipping', path: '/products', isDefault: false },
    { title: 'Orders', icon: 'credit_card', path: '/orders', isDefault: false },
    { title: 'About', icon: 'info', path: '/about', isDefault: false },
    { title: 'Settings', icon: 'settings', path: '/settings', isDefault: false }
  ];

  // Dialog properties
  public showConfirmDialog = false;
  public dialogTitle = '';
  public dialogContent = '';
  public confirmAction: () => void = () => {}; 
  
  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    public configurations: ConfigurationService
  ) { }

  get currentHomePage(): PageInfo {
    return this.homePages.find(x => x.path === this.configurations.homeUrl) || this.homePages[0];
  }

  mappedLanguages = this.languages.map(language => ({
    text: language.name,
    value: language.name
  }));

  mappedHomePages = this.homePages.map(page => ({
    text: page.title,
    value: page.path
  }));


  // Method to show confirmation dialog
  showConfirmation(title: string, content: string, action: () => void): void {
    this.dialogTitle = title;
    this.dialogContent = content;
    this.confirmAction = action;
    this.showConfirmDialog = true;
  }

  // Method to handle dialog close
  handleDialogClose(): void {
    this.showConfirmDialog = false;
  }

  // Method to handle confirmation
  handleConfirm(): void {
    this.showConfirmDialog = false;
    if (this.confirmAction) {
      this.confirmAction();
    }
  }

  reload() {
    this.showConfirmation('Reload Preferences', 'Are you sure you want to reload your preferences?', () => {
      this.alertService.startLoadingMessage();

      this.accountService.getUserPreferences()
        .subscribe({
          next: results => {
            this.alertService.stopLoadingMessage();
            this.configurations.import(results);
            this.alertService.showMessage('Defaults loaded!', '', MessageSeverity.info);
          },
          error: error => {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage('Load Error', `Unable to retrieve user preferences from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
              MessageSeverity.error, error);
          }
        });
    });
  }

  save() {
    this.showConfirmation('Save Preferences', 'Are you sure you want to save your preferences?', () => {
      this.alertService.startLoadingMessage('', 'Saving new defaults');

      this.accountService.updateUserPreferences(this.configurations.export())
        .subscribe({
          next: _ => {
            this.alertService.stopLoadingMessage();
            this.alertService.showMessage('New Defaults', 'Account defaults updated successfully', MessageSeverity.success);
          },
          error: error => {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage('Save Error', `An error occurred whilst saving configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
              MessageSeverity.error, error);
          }
        });
    });
  }

  reset() {
    this.showConfirmation('Reset Defaults', 'Are you sure you want to reset to default settings?', () => {
      this.configurations.import(null);
      this.alertService.showMessage('Defaults Reset', 'Account defaults reset completed successfully', MessageSeverity.success);
    });
  }
}
