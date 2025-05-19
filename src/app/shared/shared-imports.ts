/**
 * This file provides a centralized place for shared imports and providers
 * It replaces the previous SharedModule class with a more modern approach
 * using standalone components.
 */

// Angular modules
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion modules
import { SidebarModule, MenuModule, ToolbarModule, TabModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule, SwitchModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule, SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TooltipModule, DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownListModule, ComboBoxModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { GridModule } from '@syncfusion/ej2-angular-grids';

// Material module for backward compatibility
//import { CoordinateMaterialModule } from '../modules/material.module';

// Components and Pipes from the shared module
import { PageHeaderComponent } from './page-header/page-header.component';
import { AppDialogComponent } from './app-dialog/app-dialog.component';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { DateVehicleSelectorComponent } from './date-vehicle-selector/date-vehicle-selector.component';
import { FooterComponent } from './footer/footer.component';

// Manager services
import { ThemeManager } from './theme-picker/theme-manager';

// Export all the shared Angular and 3rd party modules
export const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
  TranslateModule,
  
  // Syncfusion modules
  SidebarModule,
  MenuModule,
  ToolbarModule,
  ButtonModule,
  SwitchModule,
  RadioButtonModule,
  DropDownButtonModule, 
  SplitButtonModule,
  TooltipModule,
  DialogModule,
  DropDownListModule,
  ComboBoxModule,
  MultiSelectModule,
  DatePickerModule,
  DateRangePickerModule,
  TextBoxModule,
  NumericTextBoxModule,
  GridModule,
  TabModule,
];

// Export all the standalone components
export const SHARED_COMPONENTS = [
  PageHeaderComponent,
  AppDialogComponent,
  ThemePickerComponent,
  DateVehicleSelectorComponent,
  FooterComponent,
  GroupByPipe
];

// Export all the services that were provided by the shared module
export const SHARED_PROVIDERS = [
  ThemeManager
];
