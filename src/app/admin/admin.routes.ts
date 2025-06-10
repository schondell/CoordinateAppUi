import { Routes } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';
import { AdminGuard } from '../services/admin-guard.service';

// Only import standalone components
import { AdminStandaloneComponent } from './admin.component.standalone';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleEditorStandaloneComponent } from './role-editor/role-editor.component.standalone';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { MachineAccountListComponent } from './machine-account-list/machine-account-list.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminStandaloneComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard], data: { title: 'Admin | Users' } },
      { path: 'roles', component: RoleListComponent, canActivate: [AuthGuard, AdminGuard], data: { title: 'Admin | Roles' } },
      { path: 'machine-accounts', component: MachineAccountListComponent, canActivate: [AuthGuard, AdminGuard], data: { title: 'Admin | Machine Accounts' } },
      { path: 'users/editor', component: UserEditorComponent, canActivate: [AuthGuard, AdminGuard], data: { title: 'Admin | User Editor' } },
      { path: 'roles/editor', component: RoleEditorStandaloneComponent, canActivate: [AuthGuard, AdminGuard], data: { title: 'Admin | Role Editor' } }
    ]
  }
];