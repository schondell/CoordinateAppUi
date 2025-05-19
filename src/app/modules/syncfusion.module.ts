import { NgModule } from '@angular/core';

// Navigation components
import { SidebarModule, MenuModule, ToolbarModule, TabModule, AccordionModule, BreadcrumbModule } from '@syncfusion/ej2-angular-navigations';

// Button components
import { ButtonModule, SwitchModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule, SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';

// Popup components
import { TooltipModule, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

// Form components
import { DropDownListModule, ComboBoxModule, MultiSelectModule, AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateRangePickerModule, TimePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextBoxModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule } from '@syncfusion/ej2-angular-inputs';

// Data components
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

// Layout components
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';

@NgModule({
    imports: [
        // Navigation
        SidebarModule,
        MenuModule,
        ToolbarModule,
        TabModule,
        AccordionModule,
        BreadcrumbModule,
        
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
        TextBoxModule,
        NumericTextBoxModule,
        MaskedTextBoxModule,
        SliderModule,
        
        // Data
        GridModule,
        ListViewModule,
        
        // Layout
        DashboardLayoutModule
    ],
    exports: [
        // Navigation
        SidebarModule,
        MenuModule,
        ToolbarModule,
        TabModule,
        AccordionModule,
        BreadcrumbModule,
        
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
        TextBoxModule,
        NumericTextBoxModule,
        MaskedTextBoxModule,
        SliderModule,
        
        // Data
        GridModule,
        ListViewModule,
        
        // Layout
        DashboardLayoutModule
    ],
})
export class CoordinateSyncfusionModule { }
