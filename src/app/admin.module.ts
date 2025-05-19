import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Standalone Components
import { AdminStandaloneComponent } from './admin.component.standalone';
import { RoleListStandaloneComponent } from './role-list/role-list.component.standalone';
import { RoleEditorStandaloneComponent } from './role-editor/role-editor.component.standalone';
import { UserListStandaloneComponent } from './user-list/user-list.component.standalone';
import { UserEditorComponent } from './user-editor/user-editor.component';

// Import Syncfusion modules directly from shared module
// No need to import Angular Material modules directly as they're being phased out

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,  // This now includes CoordinateSyncfusionModule
    AdminRoutingModule,
    
    // Import standalone components
    AdminStandaloneComponent,
    RoleListStandaloneComponent,
    RoleEditorStandaloneComponent,
    UserListStandaloneComponent,
    UserEditorComponent
  ],
  declarations: []
})
export class AdminModule { }
