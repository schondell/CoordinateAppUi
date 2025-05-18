import { NgModule, ErrorHandler , InjectionToken} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthScopeInterceptor } from './services/auth-scope-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastaModule } from 'ngx-toasta';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService, OidcTempStorage } from './services/oidc-helper.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { AppComponent } from './app.component';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { AboutComponent } from './components/about/about.component';
import { OverviewComponent } from './components/overview/overview.component';
import { WorkItemComponent } from './components/workitem/workitem.component';
import { HistoryComponent } from "./components/history/history.component";
import { TripComponent } from "./components/history/trip/trip.component";
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import {
    AccordionModule,
    MenuModule,
    SidebarModule,
    ToolbarModule,
    TreeViewModule
} from "@syncfusion/ej2-angular-navigations";
import { DropDownButtonModule, SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import {GridModule, PagerModule, PageService, SortService ,ToolbarService, PdfExportService, ExcelExportService} from '@syncfusion/ej2-angular-grids';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule} from "@syncfusion/ej2-angular-popups";
import { CircularGaugeModule} from "@syncfusion/ej2-angular-circulargauge";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import { CalendarModule, DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";

// Import standalone components that need to be integrated into the traditional module architecture
import { SettingsStandaloneComponent } from './settings/settings.component.standalone';
import { UserEditorStandaloneComponent } from './admin/user-editor/user-editor.component.standalone';
import { RoleEditorStandaloneComponent } from './admin/role-editor/role-editor.component.standalone'; 
import { UserListStandaloneComponent } from './admin/user-list/user-list.component.standalone';
import { AboutStandaloneComponent } from './components/about/about.component.standalone';

// Import migrated standalone components
import { LoginComponent } from './components/login/login.component';
import { LoginControlComponent } from './components/login/login-control.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TodoDemoComponent } from './components/controls/todo-demo.component';
import { StatisticsDemoComponent } from './components/controls/statistics-demo.component';
import { NotificationsViewerComponent } from './components/controls/notifications-viewer.component';
import { AddTaskDialogComponent } from './components/controls/add-task-dialog.component';
import { RouteviewComponent }  from './components/routeview/routeview.component';
import { VehicleMapComponent } from "./components/controls/vehicle-map/vehicle-map.component";
import { DisplayMultiTripFormComponent } from './components/controls/display-multi-trip-form/display-multi-trip-form.component';
import { DisplayTripFormComponent } from "./components/controls/display-trip-form/display-trip-form.component";
import { DrivingJournalComponent } from "./components/driving-journal/driving-journal/driving-journal.component";
import { DrivingJournalTableComponent } from "./components/driving-journal/driving-journal-table/driving-journal-table.component";
import { AdminComponent } from './admin/admin.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { RoleListComponent } from './admin/role-list/role-list.component';
import { RoleEditorComponent } from './admin/role-editor/role-editor.component';
import { EditRoleDialogComponent } from './admin/edit-role-dialog/edit-role-dialog.component';
import { EditUserDialogComponent } from './admin/edit-user-dialog/edit-user-dialog.component';
import { UserEditorComponent } from './admin/user-editor/user-editor.component';

export const SOURCE_FILES = new InjectionToken<string>('sourceFiles');
@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    AuthCallbackComponent,
    AboutComponent,
    OverviewComponent,
    WorkItemComponent,
    HistoryComponent, 
    TripComponent,
    VehicleCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    SharedModule,
    HttpClientModule,
    AdminModule,
    SettingsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    OAuthModule.forRoot(),
    ToastaModule.forRoot(),
    NgChartsModule,
    CalendarModule,
    DateRangePickerModule,
    DropDownListModule,
    ToolbarModule,
    DropDownButtonModule,
    SidebarModule,
    TreeViewModule,
    TabModule,
    ReactiveFormsModule,
    GridModule,
    DatePickerModule,
    DropDownListModule,
    AccordionModule,
    DialogModule,
    PagerModule,
    CircularGaugeModule,
    MenuModule,
    ButtonModule,
    SplitButtonModule,
    
    // Import standalone components
    LoginComponent,
    LoginControlComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    CustomersComponent,
    ProductsComponent,
    OrdersComponent,
    NotFoundComponent,
    TodoDemoComponent,
    StatisticsDemoComponent,
    NotificationsViewerComponent,
    AddTaskDialogComponent,
    RouteviewComponent,
    VehicleMapComponent,
    DisplayMultiTripFormComponent,
    DisplayTripFormComponent,
    DrivingJournalComponent,
    DrivingJournalTableComponent,
    AdminComponent,
    UserListComponent,
    RoleListComponent,
    RoleEditorComponent,
    EditRoleDialogComponent,
    EditUserDialogComponent,
    UserEditorComponent,
    SettingsStandaloneComponent,
    UserEditorStandaloneComponent,
    RoleEditorStandaloneComponent,
    UserListStandaloneComponent,
    AboutStandaloneComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: OAuthStorage, useClass: OidcTempStorage },
    { provide: SOURCE_FILES, useValue: { files: [] } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthScopeInterceptor, multi: true },
    AlertService,
    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    AccountEndpoint,
    LocalStoreManager,
    OidcHelperService,
    DatePipe,
    DecimalPipe,
    SortService,
    PageService,
    PdfExportService, ToolbarService,
    ExcelExportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('AppModule initialized');
  }
}
