import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { RoleListComponent } from './role-list/role-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { RoleEditorStandaloneComponent } from './role-editor/role-editor.component.standalone';
import { UserEditorStandaloneComponent } from './user-editor/user-editor.component.standalone';
import { UserListStandaloneComponent } from './user-list/user-list.component.standalone';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Users' } },
      { path: 'roles', component: RoleListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Roles' } },
      // Additional routes for standalone components
      { path: 'users/editor', component: UserEditorStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Admin | User Editor' } },
      { path: 'roles/editor', component: RoleEditorStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Admin | Role Editor' } }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService, AuthGuard
  ]
})
export class AdminRoutingModule { }
