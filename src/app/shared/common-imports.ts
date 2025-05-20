// Common imports for Angular standalone components

// Angular Core
export { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, Inject, CUSTOM_ELEMENTS_SCHEMA, Injectable, ErrorHandler } from '@angular/core';

// Common
export { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

// Forms
export { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

// Router
export { RouterModule, Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';

// HTTP
export { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

// CDK
export { DragDropModule } from '@angular/cdk/drag-drop';
export { MediaMatcher } from '@angular/cdk/layout';

// Translation
export { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

// OAuth
export { OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

// Toasta
export { ToastaModule, ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

// Google Maps
export { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';

// Charts
export { NgChartsModule } from 'ng2-charts';

// Import our common local components and services we frequently use
export { AppTranslationService } from '../services/app-translation.service';
export { AlertService, MessageSeverity, AlertCommand } from '../services/alert.service';
export { AuthService } from '../services/auth.service';
export { AuthGuard } from '../services/auth-guard.service';
export { ConfigurationService } from '../services/configuration.service';
export { NotificationService } from '../services/notification.service';
export { AccountService } from '../services/account.service';
export { ThemeManager } from './theme-picker/theme-manager';
export { AppDialogComponent } from './app-dialog/app-dialog.component';
export { FooterComponent } from './footer/footer.component';
export { PageHeaderComponent } from './page-header/page-header.component';
export { SidebarStandaloneComponent } from './sidebar/sidebar.component.standalone';
export { GroupByPipe } from '../pipes/group-by.pipe';