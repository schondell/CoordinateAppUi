import { Routes } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';

// Only import standalone components
import { AdminStandaloneComponent } from './admin.component.standalone';
import { RoleListStandaloneComponent } from './role-list/role-list.component.standalone';
import { RoleEditorStandaloneComponent } from './role-editor/role-editor.component.standalone';
import { UserListStandaloneComponent } from './user-list/user-list.component.standalone';
import { UserEditorComponent } from './user-editor/user-editor.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminStandaloneComponent,
    children: [
      { path: 'users', component: UserListStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Admin | Users' } },
      { path: 'roles', component: RoleListStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Admin | Roles' } },
      { path: 'users/editor', component: UserEditorComponent, canActivate: [AuthGuard], data: { title: 'Admin | User Editor' } },
      { path: 'roles/editor', component: RoleEditorStandaloneComponent, canActivate: [AuthGuard], data: { title: 'Admin | Role Editor' } }
    ]
  }
];