import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminGuard } from './services/admin-guard.service';
import { HistoryComponent } from "./components/history/history.component";
import { WorkItemComponent } from "./components/workitem/workitem.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { RouteviewComponent } from "./components/routeview/routeview.component";
import {
  CustomerWithWorkItemTableComponentComponent
} from "./components/customer-with-work-item-table-component/customer-with-work-item-table-component.component";
import {
  WorkItemTableComponentComponent
} from "./components/work-item-table-component/work-item-table-component.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { title: 'Home' },
    children: [
      { path: '', redirectTo: 'map-overview', pathMatch: 'full' },
      { path: 'map-overview', component: RouteviewComponent },
      { path: 'route-planning', component: CustomerWithWorkItemTableComponentComponent },
      { path: 'all-workitems', component: WorkItemTableComponentComponent }
    ]
  },
  
  // Lazy-loaded routes
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component.standalone').then(c => c.SettingsStandaloneComponent),
    canActivate: [AuthGuard],
    data: { title: 'Settings' }
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component').then(c => c.CustomersComponent),
    canActivate: [AuthGuard],
    data: { title: 'Customers' }
  },
  {
    path: 'management/workorders',
    loadComponent: () => import('./components/workorders/workorders.component').then(c => c.WorkOrdersComponent),
    canActivate: [AuthGuard],
    data: { title: 'Work Order Management' }
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(c => c.ProductsComponent),
    canActivate: [AuthGuard],
    data: { title: 'Products' }
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/orders/orders.component').then(c => c.OrdersComponent),
    canActivate: [AuthGuard],
    data: { title: 'Orders' }
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component.standalone').then(c => c.AboutStandaloneComponent),
    data: { title: 'About Us' }
  },
  {
    path: 'journal',
    loadComponent: () => import('./components/driving-journal/driving-journal/driving-journal.component').then(c => c.DrivingJournalComponent),
    canActivate: [AuthGuard],
    data: { title: 'Driving Journal' }
  },
  {
    path: 'journal/year/:year/month/:month/vehicleid/:vehicleId',
    loadComponent: () => import('./components/driving-journal/driving-journal/driving-journal.component').then(c => c.DrivingJournalComponent),
    canActivate: [AuthGuard],
    data: { title: 'Driving Journal' }
  },
  {
    path: 'history',
    loadComponent: () => import('./components/history/history.component').then(c => c.HistoryComponent),
    canActivate: [AuthGuard],
    data: { title: 'History' }
  },
  {
    path: 'history/year/:year/month/:month/vehicleid/:vehicleId',
    loadComponent: () => import('./components/history/history.component').then(c => c.HistoryComponent),
    canActivate: [AuthGuard],
    data: { title: 'History' }
  },
  
  // Authentication routes - kept eagerly loaded for better user experience
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'logout', component: LogoutComponent, data: { title: 'Logout' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'confirmemail', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'recoverpassword', component: RecoverPasswordComponent, data: { title: 'Recover Password' } },
  { path: 'resetpassword', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  
  // Other routes
  { path: 'workitem', component: WorkItemComponent, canActivate: [AuthGuard], data: { title: 'WorkItem' } },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } }
];
