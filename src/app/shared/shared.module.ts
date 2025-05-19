import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

// Import the Syncfusion module instead of individual components
import { CoordinateSyncfusionModule } from '../modules/syncfusion.module';

// We'll keep Material module for backward compatibility until all components are migrated
//import { CoordinateMaterialModule } from '../modules/material.module';

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
    
    // Use the consolidated Syncfusion module
    CoordinateSyncfusionModule,
    
    // Standalone components
    PageHeaderComponent,
    GroupByPipe,
    AppDialogComponent,
    DateVehicleSelectorComponent,
    FooterComponent,
    ThemePickerComponent
  ],
  exports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    
    // Use the consolidated Syncfusion module
    CoordinateSyncfusionModule,
    
    // Legacy Material module - will be phased out gradually
    //CoordinateMaterialModule,
    
    // Standalone Components and Pipes
    PageHeaderComponent,
    GroupByPipe,
    AppDialogComponent,
    DateVehicleSelectorComponent,
    FooterComponent,
    ThemePickerComponent
  ],
  declarations: [
    // No declarations - all components are standalone
  ],
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
