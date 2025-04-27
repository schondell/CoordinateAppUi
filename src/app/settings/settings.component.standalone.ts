import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion imports
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { TabModule, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';

// Components and services
// Import UserEditorComponent once it's converted to standalone
// import { UserEditorComponent } from '../admin/user-editor/user-editor.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { AppTranslationService } from '../services/app-translation.service';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { fadeInOut } from '../services/animations';
import { Utilities } from '../services/utilities';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.standalone.html',
  styleUrls: ['./settings.component.standalone.scss'],
  animations: [fadeInOut],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    AccordionModule,
    TabModule,
    ButtonModule,
    TooltipModule,
    UserPreferencesComponent
    // UserEditorComponent will be imported once it's converted to standalone
  ]
})
export class SettingsStandaloneComponent implements OnInit, OnDestroy, AfterViewInit {
  fragmentSubscription: any;
  activeTabIndex = 0;
  
  @ViewChild('settingsTabs') tabInstance: TabComponent;
  
  // Properties for Syncfusion Tabs
  public headerText: Object[] = [
    { text: 'Profile' },
    { text: 'Preferences' }
  ];

  // Reference to UserPreferencesComponent
  @ViewChild(UserPreferencesComponent) userPreferences: UserPreferencesComponent;

  // We'll import UserEditorComponent once it's converted to standalone
  // @ViewChild(UserEditorComponent) userProfile: UserEditorComponent;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: AppTranslationService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.fragmentSubscription = this.route.fragment.subscribe(anchor => {
      switch ((anchor || '').toLowerCase()) {
        case 'preferences':
          this.activeTabIndex = 1;
          break;
        default:
          this.activeTabIndex = 0;
      }
    });
  }

  ngAfterViewInit() {
    this.loadCurrentUserData();
    
    // We'll implement this once UserEditorComponent is converted
    /*
    this.userProfile.userSaved$.subscribe(() => {
      this.alertService.showMessage('Success', 'Changes to your User Profile were saved successfully', MessageSeverity.success);
    });
    */
  }

  ngOnDestroy() {
    this.fragmentSubscription.unsubscribe();
  }

  // Method to handle tab selection
  public tabSelected(args: any): void {
    const selectedIndex = args.selectedIndex;
    let fragment = '';
    
    if (selectedIndex === 0) {
      fragment = 'profile';
    } else if (selectedIndex === 1) {
      fragment = 'preferences';
    }
    
    this.navigateToFragment(fragment);
  }

  public navigateToFragment(fragment: string) {
    if (fragment) {
      this.router.navigateByUrl(`/settings#${fragment}`);
    }
  }
  
  // Methods for user preferences
  public resetPreferences(): void {
    if (this.userPreferences) {
      this.userPreferences.reset();
    }
  }
  
  public savePreferences(): void {
    if (this.userPreferences) {
      this.userPreferences.save();
    }
  }
  
  public reloadPreferences(): void {
    if (this.userPreferences) {
      this.userPreferences.reload();
    }
  }

  private loadCurrentUserData() {
    this.alertService.startLoadingMessage();

    if (this.canViewRoles) {
      this.accountService.getUserAndRoles().subscribe({
        next: results => this.onCurrentUserDataLoadSuccessful(results[0], results[1]),
        error: error => this.onCurrentUserDataLoadFailed(error)
      });
    } else {
      this.accountService.getUser().subscribe({
        next: user => this.onCurrentUserDataLoadSuccessful(user, user.roles.map(r => new Role(r))),
        error: error => this.onCurrentUserDataLoadFailed(error)
      });
    }
  }

  private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
    this.alertService.stopLoadingMessage();
    // Will implement once UserEditorComponent is converted
    // this.userProfile.setUser(user, roles);
  }

  private onCurrentUserDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }
}