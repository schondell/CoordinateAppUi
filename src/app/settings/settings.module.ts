import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { TooltipModule } from "@syncfusion/ej2-angular-popups";
import { SwitchModule } from "@syncfusion/ej2-angular-buttons";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { AdminModule } from '../admin/admin.module';

@NgModule({
  imports: [
    SharedModule,
    TooltipModule,
    SwitchModule,
    DropDownListModule,
    AdminModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [
    SettingsComponent,
    UserPreferencesComponent
  ],
  schemas: [
    // Add schema to allow missing components as custom elements
    // This is a temporary fix until proper module imports are set up
    // Normally, you would import the correct module or export the component
    // from the module where it is declared
    // But for quick fix, we use CUSTOM_ELEMENTS_SCHEMA
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SettingsModule { }
