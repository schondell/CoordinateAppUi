import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';
// Import UserPreferencesComponent as standalone
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { AdminModule } from '../admin/admin.module';

@NgModule({
  imports: [
    SharedModule, // This now includes CoordinateSyncfusionModule with all Syncfusion components
    AdminModule,
    UserPreferencesComponent,
    SettingsComponent,
    // Import standalone component
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [

    // UserPreferencesComponent is now a standalone component imported above
  ],
  schemas: [
    // Add schema to allow missing components as custom elements
    // This is a temporary fix until proper module imports are set up
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SettingsModule { }
