import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

// We'll keep Material module for backward compatibility until all components are migrated
import { CoordinateMaterialModule } from '../modules/material.module';

// Components and Pipes
import { PageHeaderComponent } from './page-header/page-header.component';
import { AppDialogComponent } from './app-dialog/app-dialog.component';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { ThemeManager } from './theme-picker/theme-manager';
import { DateVehicleSelectorComponent } from './date-vehicle-selector/date-vehicle-selector.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
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
    
    // Legacy Material module - will be phased out gradually
    CoordinateMaterialModule,
    
    // Import standalone components
    FooterComponent,
    PageHeaderComponent,
    AppDialogComponent,
    DateVehicleSelectorComponent,
    ThemePickerComponent,
    GroupByPipe
  ],
  exports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
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
    
    // Legacy Material module - will be phased out gradually
    CoordinateMaterialModule,
    
    // Export standalone components
    FooterComponent,
    PageHeaderComponent,
    GroupByPipe,
    AppDialogComponent,
    DateVehicleSelectorComponent,
    ThemePickerComponent
  ],
  // Remove standalone components from declarations
  declarations: [],
  providers: [
    ThemeManager
  ],
  schemas: [
    // Add schema to allow missing components as custom elements
    // This is a temporary fix until proper module imports are set up
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
