import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import {TooltipModule} from "@syncfusion/ej2-angular-popups";
import {SwitchModule} from "@syncfusion/ej2-angular-buttons";
import {DropDownListModule} from "@syncfusion/ej2-angular-dropdowns";

@NgModule({
  imports: [
    SharedModule,
    TooltipModule,
    SwitchModule,
    DropDownListModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [
    SettingsComponent,
    UserPreferencesComponent
  ]
})
export class SettingsModule { }
