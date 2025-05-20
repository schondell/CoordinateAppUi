import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import all Syncfusion components needed
import {
  MenuItemModel,
  SidebarComponent,
  TreeViewComponent,
  ClickEventArgs
} from '@syncfusion/ej2-angular-navigations';

// Import from our consolidated modules
import { SyncfusionModules } from './shared/syncfusion-standalone';

import { AppTranslationService } from './services/app-translation.service';
import { AuthService } from './services/auth.service';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import { VehicleSummary } from "./models/vehicle-summary";
import { SignalrService } from "./signalr.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { LocalStoreManager } from "./services/local-store-manager.service";
import { ToastaConfig, ToastaService, ToastData, ToastOptions } from "ngx-toasta";
import { AppTitleService } from "./services/app-title.service";
import { AlertCommand, AlertService, MessageSeverity } from "./services/alert.service";
import { Permission } from "./models/permission.model";
import { AccountService } from "./services/account.service";
import { AppDialogComponent } from "./shared/app-dialog/app-dialog.component";
import { LoginDialogComponent } from "./components/login/login-dialog.component";
import { NotificationService } from "./services/notification.service";
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarStandaloneComponent } from './shared/sidebar/sidebar.component.standalone';

interface NodeItem {
  nodeId: string;
  nodeText: string;
  nodeRoute?: string;
  iconCss: string;
  nodeChild?: NodeItem[];
}

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
  @ViewChild('sidebarTreeviewInstance')
  public sidebarTreeviewInstance?: SidebarComponent;
  @ViewChild('treeviewInstance')
  public treeviewInstance?: TreeViewComponent;
  public width: string = '290px';
  public enableDock: boolean = true;
  public dockSize:string ="44px";
  public mediaQuery: string = ('(min-width: 600px)');
  public target: string = '.main-content';

  @ViewChild('sidebarMenuInstance')
  public sidebarMenuInstance!: SidebarStandaloneComponent;

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
              private notificationService: NotificationService,
              private domSanitizer: DomSanitizer,
              private router: Router,
              public signalRService: SignalrService,
              private alertService: AlertService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher)  {
    translate.setDefaultLang('fr');
    //this.matIconRegistry.addSvgIconSet(this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/custom-icons.svg'));
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
    
    // SignalR event handlers are now set up in the SignalR service itself
  }

  items: ItemModel[] = [
    {
      text: this.translate.instant('Profile'),
      iconCss: 'e-ddb-icons e-profile',
      url: '/profile'
    },
    {
      text: this.translate.instant('Settings'),
      iconCss: 'e-ddb-icons e-settings',
      url: '/settings'
    },
    {
      text: this.translate.instant('Logout'),
      iconCss: 'e-ddb-icons e-logout',
      url: '/logout'
    }
  ];

  login(): void {
    // Handle login logic
  }

  profileSettings(): void {
    // Handle profile settings logic
  }

  menuSelect(event: any): void {
    const selectedItem = event.item.text;

    switch (selectedItem) {
      case 'Profile Settings':
        this.profileSettings();
        break;
      case 'Logout':
        this.logout();
        break;
      default:
        console.warn('Unknown menu item selected:', selectedItem);
    }
  }


  public menuItems: MenuItemModel[] = [
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
          text: 'mainMenu.Vehicles',
          iconCss: 'e-icons e-menu',
          url: '/vehicle'
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

  public isSidebarCollapsed = false;

  toolbarClicked(args: ClickEventArgs) {
    if (args.item.tooltipText == "Menu") {
      this.sidebarMenuInstance.toggle();
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }
  
  onSidebarCollapsedChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  // public field:object ={ dataSource: this.data, id: 'nodeId', text: 'nodeText', child: 'nodeChild', iconCss: 'iconCss' };
  //
  // public onCreated(args: any) {
  //   (this.sidebarTreeviewInstance as SidebarComponent).element.style.visibility = '';
  // }
  public onClose(args: any) {
    (this.treeviewInstance as TreeViewComponent).collapseAll();
  }

  // onNodeSelected(event: any) {
  //   const nodeId = event.nodeData.id;
  //   const node = this.findNodeById(this.data, nodeId);
  //
  //   if(node && node.nodeRoute) {
  //     this.router.navigate([node.nodeRoute]);
  //   }
  // }

  findNodeById(data: NodeItem[], nodeId: string): NodeItem | null {
    for(const node of data) {
      if(node.nodeId === nodeId) {
        return node;
      }

      if(node.nodeChild) {
        const found = this.findNodeById(node.nodeChild, nodeId);
        if(found) {
          return found;
        }
      }
    }

    return null;
  }
  openClick() {
    if((this.sidebarTreeviewInstance as SidebarComponent).isOpen)
    {
      (this.sidebarTreeviewInstance as SidebarComponent).hide();
      (this.treeviewInstance as TreeViewComponent).collapseAll();
    }
    else {
      (this.sidebarTreeviewInstance as SidebarComponent).show();
      // (this.treeviewInstance as TreeViewComponent).expandAll();
    }
  }
   dataLoadingConsecutiveFailures = 0;
   notificationsLoadingSubscription: any;

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;

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
        this.initNotificationsLoading();
        
        // Start or restart the SignalR connection when user logs in
        if (this.authService.accessToken) {
          console.log('Restarting SignalR connection with new auth token');
          this.signalRService.startConnection(this.authService.accessToken);
        }
      } else {
        this.unsubscribeNotifications();
      }

      setTimeout(() => {
        if (!this.isUserLoggedIn) {
          this.alertService.showMessage('Session Ended!', '', MessageSeverity.default);
        }
      }, 500);
    });

   // this.refreshAdminExpanderState(this.router.url);

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.refreshAdminExpanderState((event as NavigationStart).url);
    //   }
    // });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener); // https://github.com/mdn/sprints/issues/858
    this.unsubscribeNotifications();
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

  // private refreshAdminExpanderState(currentUrl: string) {
  //   setTimeout(() => {
  //     if (this.adminExpander && currentUrl.toLowerCase().indexOf('admin') > 0) {
  //       this.adminExpander.open();
  //     }
  //   }, 200);
  // }

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

    // For now, navigate directly to login page
    this.router.navigateByUrl('/login');
    
    // TODO: Implement login dialog with Syncfusion components
    // const dialogRef = this.syncfusionDialog.open(LoginDialogComponent, { minWidth: 300 });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.alertService.resetStickyMessage();
    //   if (!result || this.authService.isSessionExpired) {
    //     this.authService.logout();
    //     this.router.navigateByUrl('/login');
    //     this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again to renew your session', MessageSeverity.warn);
    //   }
    // });
  }
//
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
//
//   openClick() {
//     if((this.sidebarTreeviewInstance as SidebarComponent).isOpen)
//     {
//       (this.sidebarTreeviewInstance as SidebarComponent).hide();
//       (this.treeviewInstance as TreeViewComponent).collapseAll();
//     }
//     else {
//       (this.sidebarTreeviewInstance as SidebarComponent).show();
//       // (this.treeviewInstance as TreeViewComponent).expandAll();
//     }
//   }
//
//
//   onCreated($event: any) {
//
//   }
// }

}

