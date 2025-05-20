// Export all Syncfusion modules for easy importing in standalone components
import { NgModule } from '@angular/core';

// Navigation components
import { SidebarModule, MenuModule, ToolbarModule, TabModule, AccordionModule, BreadcrumbModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';

// Button components
import { ButtonModule, SwitchModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule, SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';

// Popup components
import { TooltipModule, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

// Form components
import { DropDownListModule, ComboBoxModule, MultiSelectModule, AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateRangePickerModule, TimePickerModule, DateTimePickerModule, CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { TextBoxModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule } from '@syncfusion/ej2-angular-inputs';

// Data components
import { GridModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

// Layout components
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';

// Services
import { PageService, SortService, FilterService, GroupService, ToolbarService, PdfExportService, ExcelExportService } from '@syncfusion/ej2-angular-grids';

// Create a convenience object to import all Syncfusion components
export const SyncfusionStandaloneModules = {
    // Navigation
    SidebarModule,
    MenuModule,
    ToolbarModule,
    TabModule,
    AccordionModule,
    BreadcrumbModule,
    TreeViewModule,
    
    // Buttons
    ButtonModule,
    SwitchModule,
    RadioButtonModule,
    CheckBoxModule,
    DropDownButtonModule,
    SplitButtonModule,
    
    // Popups
    TooltipModule,
    DialogModule,
    ToastModule,
    
    // Form controls
    DropDownListModule,
    ComboBoxModule,
    MultiSelectModule,
    AutoCompleteModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    DateTimePickerModule,
    CalendarModule,
    TextBoxModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    SliderModule,
    
    // Data
    GridModule,
    PagerModule,
    ListViewModule,
    
    // Layout
    DashboardLayoutModule
};

// Create a list of all providers
export const SyncfusionProviders = [
    PageService,
    SortService,
    FilterService,
    GroupService,
    ToolbarService,
    PdfExportService,
    ExcelExportService
];

/**
 * This array can be easily spread into your standalone component imports
 * like this:
 * 
 * @Component({
 *   standalone: true,
 *   imports: [
 *     CommonModule,
 *     ...SyncfusionModules
 *   ]
 * })
 */
export const SyncfusionModules = [
    // Navigation
    SidebarModule,
    MenuModule,
    ToolbarModule,
    TabModule,
    AccordionModule,
    BreadcrumbModule,
    TreeViewModule,
    
    // Buttons
    ButtonModule,
    SwitchModule,
    RadioButtonModule,
    CheckBoxModule,
    DropDownButtonModule,
    SplitButtonModule,
    
    // Popups
    TooltipModule,
    DialogModule,
    ToastModule,
    
    // Form controls
    DropDownListModule,
    ComboBoxModule,
    MultiSelectModule,
    AutoCompleteModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    DateTimePickerModule,
    CalendarModule,
    TextBoxModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    SliderModule,
    
    // Data
    GridModule,
    PagerModule,
    ListViewModule,
    
    // Layout
    DashboardLayoutModule
];