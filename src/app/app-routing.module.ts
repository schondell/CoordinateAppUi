import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { Utilities } from './services/utilities';
import { HistoryComponent } from "./components/history/history.component";
import {WorkItemComponent} from "./components/workitem/workitem.component";
import {DrivingJournalComponent} from "./components/driving-journal/driving-journal/driving-journal.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {RouteviewComponent} from "./components/routeview/routeview.component";
import {
  CustomerWithWorkItemTableComponentComponent
} from "./components/customer-with-work-item-table-component/customer-with-work-item-table-component.component";
import {
  WorkItemTableComponentComponent
} from "./components/work-item-table-component/work-item-table-component.component";

@Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    const possibleSeparators = /[?;#]/;
    const indexOfSeparator = url.search(possibleSeparators);
    let processedUrl: string;

    if (indexOfSeparator > -1) {
      const separator = url.charAt(indexOfSeparator);
      const urlParts = Utilities.splitInTwo(url, separator);
      urlParts.firstPart = urlParts.firstPart.toLowerCase();
      processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
    } else {
      processedUrl = url.toLowerCase();
    }
    return super.parse(processedUrl);
  }
}

const routes: Routes = [
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
  { path: 'history/year/:year/month/:month/vehicleid/:vehicleId', component: HistoryComponent, canActivate: [AuthGuard], data: { title: 'History' } },
  { path: 'history', component: HistoryComponent },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'logout', component: LogoutComponent, data: { title: 'Logout' } },
  { path: 'workitem', component: WorkItemComponent, canActivate: [AuthGuard], data: { title: 'WorkItem' } },
  { path: 'journal/year/:year/month/:month/vehicleid/:vehicleId', component: DrivingJournalComponent, canActivate: [AuthGuard], data: { title: 'DrivingJournalComponent' } },
  { path: 'journal', component: DrivingJournalComponent, canActivate: [AuthGuard], data: { title: 'DrivingJournalComponent' } },
  // { path: 'google-login', component: AuthCallbackComponent, data: { title: 'Google Login' } },
  // { path: 'facebook-login', component: AuthCallbackComponent, data: { title: 'Facebook Login' } },
  // { path: 'twitter-login', component: AuthCallbackComponent, data: { title: 'Twitter Login' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'confirmemail', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'recoverpassword', component: RecoverPasswordComponent, data: { title: 'Recover Password' } },
  { path: 'resetpassword', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard], data: { title: 'Customers' } },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], data: { title: 'Products' } },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { title: 'Orders' } },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { title: 'Settings' } },
  { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthService,
    AuthGuard,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }]
})
export class AppRoutingModule { }

