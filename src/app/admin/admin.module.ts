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

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    
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
