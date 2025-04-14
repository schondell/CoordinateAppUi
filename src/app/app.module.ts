import { NgModule, ErrorHandler , InjectionToken} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
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
import { FooterModule } from './shared/footer/footer.component';
import { ThemePickerModule } from './shared/theme-picker/theme-picker.component';
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
import { LoginComponent } from './components/login/login.component';
import { LoginControlComponent } from './components/login/login-control.component';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TodoDemoComponent } from './components/controls/todo-demo.component';
import { StatisticsDemoComponent } from './components/controls/statistics-demo.component';
import { NotificationsViewerComponent } from './components/controls/notifications-viewer.component';
import { AddTaskDialogComponent } from './components/controls/add-task-dialog.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RouteviewComponent }  from './components/routeview/routeview.component';
import { WorkItemComponent } from './components/workitem/workitem.component';
import { VehicleMapComponent } from "./components/controls/vehicle-map/vehicle-map.component";
// import { CountryModule } from './components/generated/country/country.module';
// import { GpstrackertypeModule } from './components/generated/gpstrackertype/gpstrackertype.module';
import { DisplayMultiTripFormComponent } from './components/controls/display-multi-trip-form/display-multi-trip-form.component'
import { HistoryComponent } from "./components/history/history.component";
import { TripComponent } from "./components/history/trip/trip.component";
import { DisplayTripFormComponent } from "./components/controls/display-trip-form/display-trip-form.component";
import { CalendarModule, DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
// import { AddressComponent } from './components/generated/address/address/address.component';
// import { AddressTableComponent } from './components/generated/address/address/form/address-table/address-table.component'
// import { VehicleModule } from "./components/generated/vehicle/vehicle.module";
// import { GpsTrackerComponent } from "./components/generated/gpstracker/gpstracker/gpstracker.component";
// import { GpsTrackerTableComponent } from "./components/generated/gpstracker/gpstracker/form/gpstracker-table/gpstracker-table.component";
import { DrivingJournalComponent } from "./components/driving-journal/driving-journal/driving-journal.component";
import { DrivingJournalTableComponent } from "./components/driving-journal/driving-journal-table/driving-journal-table.component";
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import {
    AccordionModule,
    MenuModule,
    SidebarModule,
    ToolbarModule,
    TreeViewModule
} from "@syncfusion/ej2-angular-navigations";
import {DropDownButtonModule, SplitButtonModule} from '@syncfusion/ej2-angular-splitbuttons';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import {GridModule, PagerModule, PageService, SortService ,ToolbarService, PdfExportService, ExcelExportService} from '@syncfusion/ej2-angular-grids';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
// import { CustomerWithWorkItemTableComponent } from "./components/generated/customerwithworkitem-table/customerwithworkitem-table.component";
// import { WorkItemTableComponent } from "./components/generated/workitem-table/workitem-table.component";
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule} from "@syncfusion/ej2-angular-popups";
import { CircularGaugeModule} from "@syncfusion/ej2-angular-circulargauge";
import { DateVehicleSelectorComponent} from "./shared/date-vehicle-selector/date-vehicle-selector.component";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";


export const SOURCE_FILES = new InjectionToken<string>('sourceFiles');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, LoginControlComponent, LoginDialogComponent,
    AuthCallbackComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    CustomersComponent,
    ProductsComponent,
    OrdersComponent,
    AboutComponent,
    NotFoundComponent,
    NotificationsViewerComponent,
    AddTaskDialogComponent,
    StatisticsDemoComponent, TodoDemoComponent,
    OverviewComponent, RouteviewComponent, VehicleMapComponent,
    DisplayMultiTripFormComponent, HistoryComponent, TripComponent,
    DisplayTripFormComponent,
    // AddressComponent,
    // AddressTableComponent,
    WorkItemComponent,
    // GpsTrackerComponent,
    // GpsTrackerTableComponent,
    DrivingJournalComponent,
    //DrivingJournalTableComponent,
    VehicleCardComponent,
    // CustomerWithWorkItemTableComponent,
    // WorkItemTableComponent,
    DateVehicleSelectorComponent,
  ],
  imports: [
    GoogleMapsModule,
    SharedModule,
    FooterModule,
    ThemePickerModule,
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
    // CountryModule,
    // GpstrackertypeModule,
    CalendarModule,
    // VehicleModule,
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
    DrivingJournalTableComponent,
    ButtonModule,
    SplitButtonModule,
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
}
