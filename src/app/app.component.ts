import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import Syncfusion components
import {
  MenuItemModel,
  ClickEventArgs,
  SidebarComponent
} from '@syncfusion/ej2-angular-navigations';

// Import from our consolidated modules
import { SyncfusionModules } from './shared/syncfusion-standalone';

import { AppTranslationService } from './services/app-translation.service';
import { AuthService } from './services/auth.service';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import { SignalrService } from "./signalr.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { LocalStoreManager } from "./services/local-store-manager.service";
import { ToastaConfig, ToastaService, ToastData, ToastOptions } from "ngx-toasta";
import { AppTitleService } from "./services/app-title.service";
import { AlertCommand, AlertService, MessageSeverity } from "./services/alert.service";
import { Permission } from "./models/permission.model";
import { AccountService } from "./services/account.service";
import { AdminGuard } from "./services/admin-guard.service";
import { AppDialogComponent } from "./shared/app-dialog/app-dialog.component";
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarStandaloneComponent } from './shared/sidebar/sidebar.component.standalone';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    // Angular core modules
    CommonModule,
    RouterModule,
    TranslateModule,
    
    // Import all Syncfusion modules needed
    ...SyncfusionModules,
    
    // App components
    AppDialogComponent,
    FooterComponent,
    SidebarStandaloneComponent
  ]
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('appDialog')
  public appDialog!: AppDialogComponent;
  @ViewChild('sidebarComponent')
  public sidebarComponent!: SidebarStandaloneComponent;

  // Simple sidebar toggle state
  public sidebarCollapsed = false;

  // User information for sidebar
  userDisplayName: string = '';
  userRole: string = 'User';

  private readonly _mobileQueryListener: () => void;
  isUserLoggedIn: boolean;
  isAdminExpanded = false;
  newNotificationCount = 0;
  appTitle = 'Coordinate';
  mobileQuery: MediaQueryList;
  stickyToasties: number[] = [];

  gT = (key: string | Array<string>, interpolateParams?: object) => this.translationService.getTranslation(key, interpolateParams);

  constructor(private translate: TranslateService,
              private translationService: AppTranslationService,
              private storageManager: LocalStoreManager,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private appTitleService: AppTitleService,
              private authService: AuthService,
              private accountService: AccountService,
              private adminGuard: AdminGuard,
              private domSanitizer: DomSanitizer,
              public router: Router,
              public signalRService: SignalrService,
              private alertService: AlertService,
              private notificationService: NotificationService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher)  {
    translate.setDefaultLang('fr');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line:deprecation
    this.mobileQuery.addListener(this._mobileQueryListener); // https://github.com/mdn/sprints/issues/858

    this.storageManager.initialiseStorageSyncListener();

    this.toastaConfig.theme = 'material';
    this.toastaConfig.position = 'top-right';
    this.toastaConfig.limit = 100;
    this.toastaConfig.showClose = true;
    this.toastaConfig.showDuration = false;

    this.appTitleService.appName = this.appTitle;

    // Initial SignalR connection will be established if there's a token
    if (this.authService.accessToken) {
      this.signalRService.startConnection(this.authService.accessToken);
    }
    
    // Update user display name and role if user is logged in
    if (this.authService.currentUser) {
      this.userDisplayName = this.authService.currentUser.userName;
      this.userRole = this.authService.currentUser.roles.length > 0 ?
                      this.authService.currentUser.roles[0] : 'User';
    }
  }

  // Simple sidebar toggle
  toggleSidebar() {
    if (this.sidebarComponent) {
      this.sidebarComponent.toggle();
    } else {
      // Fallback if component not yet initialized
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
    console.log('Sidebar toggled:', this.sidebarCollapsed ? 'collapsed' : 'expanded');
  }

  items: ItemModel[] = [
    {
      text: this.gT('account.Profile'),
      iconCss: 'e-ddb-icons e-profile'
    },
    {
      text: this.gT('account.Settings'),
      iconCss: 'e-ddb-icons e-settings'
    },
    {
      text: this.gT('account.Logout'),
      iconCss: 'e-ddb-icons e-logout'
    }
  ];

  menuSelect(event: any): void {
    const selectedItem = event.item.text;

    // Use translation keys to identify menu items
    if (selectedItem === this.gT('account.Profile')) {
      this.router.navigate(['/settings']); // Navigate to settings for now, until we have a dedicated profile page
    } else if (selectedItem === this.gT('account.Settings')) {
      this.router.navigate(['/settings']);
    } else if (selectedItem === this.gT('account.Logout')) {
      this.logout();
    } else {
      console.warn('Unknown menu item selected:', selectedItem);
    }
  }

  login(): void {
    // Handle login logic
  }

  profileSettings(): void {
    // Handle profile settings logic
  }

  // Make sure the menuItems are properly defined as an array of objects with the expected structure
  public menuItems = [
    {
      text: 'mainMenu.Home',
      iconCss: 'e-icons e-home',
      url: '/'
    },
    {
      text: 'mainMenu.OverView',
      iconCss: 'e-icons e-dashboard',
      url: '/job-overview'
    },
    {
      text: 'mainMenu.DrivingJournal',
      iconCss: 'e-icons e-book',
      url: '/journal'
    },
    {
      text: 'mainMenu.History',
      iconCss: 'e-icons e-history',
      url: '/history'
    },
    {
      text: 'mainMenu.DataManagement',
      iconCss: 'e-icons e-work',
      items: [
        {
          text: 'mainMenu.Address',
          iconCss: 'e-icons e-menu',
          url: '/address'
        },
        {
          text: 'mainMenu.GpsTrackers',
          iconCss: 'e-icons e-menu',
          url: '/gpstracker'
        }
      ]
    },
    {
      text: 'Settings',
      iconCss: 'e-icons e-settings',
      url: '/settings'
    },
    {
      text: 'Admin',
      iconCss: 'e-icons e-admin',
      items: [
        {
          text: 'Users',
          iconCss: 'e-icons e-user',
          url: '/admin/users'
        },
        {
          text: 'Roles',
          iconCss: 'e-icons e-menu',
          url: '/admin/roles'
        }
      ]
    },
    {
      text: 'mainMenu.About',
      iconCss: 'e-icons e-info',
      url: '/about'
    }
  ];

  toolbarClicked(args: ClickEventArgs) {
    if (args.item.tooltipText === "Menu") {
      this.toggleSidebar();
    }
  }
  onSidebarCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

   dataLoadingConsecutiveFailures = 0;
   notificationsLoadingSubscription: any;

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;

    // Update user display name if the user is logged in
    if (this.authService.currentUser) {
      this.userDisplayName = this.authService.currentUser.userName;
      this.userRole = this.authService.currentUser.roles.length > 0 ?
                      this.authService.currentUser.roles[0] : 'User';
    }

    setTimeout(() => {
      if (this.isUserLoggedIn) {
        this.alertService.resetStickyMessage();
        this.alertService.showMessage('Login', `Welcome back ${this.userName}!`, MessageSeverity.default);
      }
    }, 2000);

    this.alertService.getDialogEvent().subscribe(alert => {
      if (this.appDialog) {
        this.appDialog.openDialog(alert);
      }
    });
    this.alertService.getMessageEvent().subscribe(message => this.showToast(message));

    this.authService.reLoginDelegate = () => this.showLoginDialog();

    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (this.isUserLoggedIn) {
        // Update user display name
        if (this.authService.currentUser) {
          this.userDisplayName = this.authService.currentUser.userName;
          this.userRole = this.authService.currentUser.roles.length > 0 ?
                          this.authService.currentUser.roles[0] : 'User';
        }

        // Start or restart the SignalR connection when user logs in
        if (this.authService.accessToken) {
          console.log('Restarting SignalR connection with new auth token');
          this.signalRService.startConnection(this.authService.accessToken);
        }
      } else {
        // Clear user display name on logout
        this.userDisplayName = '';
        this.userRole = 'User';
          }

      setTimeout(() => {
        if (!this.isUserLoggedIn) {
          this.alertService.showMessage('Session Ended!', '', MessageSeverity.default);
        }
      }, 500);
    });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener); // https://github.com/mdn/sprints/issues/858
  }

  mainNav = {
    isOpen: false,
    toggle() {
      this.isOpen = !this.isOpen;
    }
    };

  private unsubscribeNotifications() {
    if (this.notificationsLoadingSubscription) {
      this.notificationsLoadingSubscription.unsubscribe();
    }
  }

  initNotificationsLoading() {
    this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
      .subscribe({
        next: notifications => {
          this.dataLoadingConsecutiveFailures = 0;
          this.newNotificationCount = notifications.filter(n => !n.isRead).length;
        },
        error: error => {
          this.alertService.logError(error);

          if (this.dataLoadingConsecutiveFailures++ < 20) {
            setTimeout(() => this.initNotificationsLoading(), 5000);
    } else {
            this.alertService.showStickyMessage('Load Error', 'Loading new notifications from the server failed!', MessageSeverity.error);
    }
        }
      });
  }

  markNotificationsAsRead() {
    const recentNotifications = this.notificationService.recentNotifications;

    if (recentNotifications.length) {
      this.notificationService.readUnreadNotification(recentNotifications.map(n => n.id), true)
        .subscribe({
          next: _ => {
            for (const n of recentNotifications) {
              n.isRead = true;
            }
            this.newNotificationCount = recentNotifications.filter(n => !n.isRead).length;
          },
          error: error => {
            this.alertService.logError(error);
            this.alertService.showMessage('Notification Error', 'Marking read notifications failed', MessageSeverity.error);
          }
        });
    }
  }

  showLoginDialog(): void {
    this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again', MessageSeverity.info);
    this.router.navigateByUrl('/login');
  }

  showToast(alert: AlertCommand) {
    if (alert.operation === 'clear') {
      for (const id of this.stickyToasties.slice(0)) {
        this.toastaService.clear(id);
      }
      return;
    }

    const toastOptions: ToastOptions = {
      title: alert.message.summary,
      msg: alert.message.detail,
    };

    if (alert.operation === 'add_sticky') {
      toastOptions.timeout = 0;

      toastOptions.onAdd = (toast: ToastData) => {
        this.stickyToasties.push(toast.id);
      };

      toastOptions.onRemove = (toast: ToastData) => {
        const index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        if (alert.onRemove) {
          alert.onRemove();
        }

        toast.onAdd = null;
        toast.onRemove = null;
      };
    } else {
      toastOptions.timeout = 4000;
    }

    switch (alert.message.severity) {
      case MessageSeverity.default: this.toastaService.default(toastOptions); break;
      case MessageSeverity.info: this.toastaService.info(toastOptions); break;
      case MessageSeverity.success: this.toastaService.success(toastOptions); break;
      case MessageSeverity.error: this.toastaService.error(toastOptions); break;
      case MessageSeverity.warn: this.toastaService.warning(toastOptions); break;
      case MessageSeverity.wait: this.toastaService.wait(toastOptions); break;
    }
  }

  logout() {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : '';
  }

  get fullName(): string {
    return this.authService.currentUser ? this.authService.currentUser.fullName : '';
  }

  get canViewCustomers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewHistory() {
    return this.accountService.userHasPermission(Permission.viewHistoryPermission);
  }

  get canViewProducts() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewOrders() {
    return true;
  }

  get canViewVehicles() {
    return true;
  }

  get canViewMetadata() {
    return true;
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canViewAdminMenu() {
    return this.adminGuard.canViewAdminMenu();
  }
}

