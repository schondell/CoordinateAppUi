import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatExpansionPanel, MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { UserEditorComponent } from '../admin/user-editor/user-editor.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { AppTranslationService } from '../services/app-translation.service';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { fadeInOut } from '../services/animations';
import { Utilities } from '../services/utilities';
import {PageHeaderComponent} from "../shared/page-header/page-header.component";
import {CoordinateSyncfusionModule} from "../modules/syncfusion.module";
import {AccordionAllModule} from "@syncfusion/ej2-angular-navigations";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeInOut],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    UserEditorComponent,
    UserPreferencesComponent,
    PageHeaderComponent,
    CoordinateSyncfusionModule,
    AccordionAllModule
  ]
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  fragmentSubscription: any;

  @ViewChild('profile', { static: true }) profilePanel: MatExpansionPanel;
  @ViewChild('preferences', { static: true }) preferencesPanel: MatExpansionPanel;

  @ViewChild(UserEditorComponent, { static: true }) userProfile: UserEditorComponent;

  @ViewChild(UserPreferencesComponent, { static: true }) userPreferences: UserPreferencesComponent;

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
          this.preferencesPanel.open();
          break;
        default:
          this.profilePanel.open();
      }
    });
  }

  onAccordionExpanding(event: any) {
    const header = event?.item?.header;
    if (header && header.includes('Profile')) {
      this.navigateToFragment('profile');
    } else if (header && header.includes('Preferences')) {
      this.navigateToFragment('preferences');
    }
  }

  ngAfterViewInit() {
    this.loadCurrentUserData();

    this.userProfile.userSaved$.subscribe(() => {
      this.alertService.showMessage('Success', 'Changes to your User Profile was saved successfully', MessageSeverity.success);
    });
  }

  ngOnDestroy() {
    this.fragmentSubscription.unsubscribe();
  }

  public navigateToFragment(fragment: string) {
    if (fragment) {
      this.router.navigateByUrl(`/settings#${fragment}`);
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
    this.userProfile.setUser(user, roles);
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
