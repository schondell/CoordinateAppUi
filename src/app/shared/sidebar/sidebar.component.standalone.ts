import { Component, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion components
import { SidebarModule, SidebarComponent as EjsSidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-sidebar-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SidebarModule,
    MenuModule
  ],
  template: `
    <ejs-sidebar id="menuSidebar" class="sidebar-menu expanded" #sidebarMenuInstance
                 [enableDock]='enableDock'
                 [dockSize]="dockSize" 
                 [width]="width" 
                 [target]="target" 
                 [isOpen]="isOpen" 
                 type="Auto">
      <div class="main-menu">
        <div>
          <ejs-menu [items]="menuItems" orientation='Vertical' cssClass='dock-menu'>
            <ng-template #template let-item>
              <a [routerLink]="item.url" [title]="isSidebarCollapsed ? (item.text | translate) : ''">
                <span class="e-menu-icon {{ item.iconCss }}"></span>
                <span class="e-menu-text">{{ item.text | translate }}</span>
              </a>
            </ng-template>
          </ejs-menu>
        </div>
      </div>
    </ejs-sidebar>
  `,
  styles: [`
    .sidebar-menu {
      background-color: #f8f9fa;
      border-right: 1px solid #e9ecef;
    }
    
    .main-menu {
      padding-top: 20px;
    }
    
    .e-menu-icon {
      margin-right: 12px;
      font-size: 18px;
    }
    
    .e-menu-text {
      font-size: 14px;
    }
    
    .dock-menu {
      width: 100%;
    }
    
    :host ::ng-deep .e-menu-wrapper.e-vertical {
      width: 100%;
    }
    
    :host ::ng-deep .e-menu-wrapper ul.e-menu {
      border: none;
      background-color: transparent;
    }
    
    :host ::ng-deep .e-menu-wrapper ul.e-menu .e-menu-item {
      height: 48px;
      line-height: 48px;
      border-radius: 0;
      color: #333;
    }
    
    :host ::ng-deep .e-menu-wrapper ul.e-menu .e-menu-item:hover {
      background-color: rgba(63, 81, 181, 0.08);
    }
    
    :host ::ng-deep .e-menu-wrapper ul.e-menu .e-menu-item.e-selected {
      background-color: rgba(63, 81, 181, 0.12);
      color: var(--app-primary-color, #3f51b5);
    }
  `]
})
export class SidebarStandaloneComponent {
  @ViewChild('sidebarMenuInstance') sidebarMenuInstance: EjsSidebarComponent;
  
  @Input() enableDock = true;
  @Input() dockSize = '60px';
  @Input() width = '240px';
  @Input() target = '.main-content';
  @Input() isOpen = true;
  @Input() isSidebarCollapsed = false;
  
  menuItems = [
    {
      text: 'Home',
      iconCss: 'e-icons e-home',
      url: '/home'
    },
    {
      text: 'Dashboard',
      iconCss: 'e-icons e-dashboard',
      url: '/dashboard'
    },
    {
      text: 'History',
      iconCss: 'e-icons e-history',
      url: '/history'
    },
    {
      text: 'Journal',
      iconCss: 'e-icons e-book',
      url: '/journal'
    },
    {
      text: 'Work Items',
      iconCss: 'e-icons e-work',
      url: '/workitem'
    },
    {
      text: 'Admin',
      iconCss: 'e-icons e-admin',
      url: '/admin'
    },
    {
      text: 'Settings',
      iconCss: 'e-icons e-settings',
      url: '/settings'
    },
    {
      text: 'About',
      iconCss: 'e-icons e-info',
      url: '/about'
    },
    {
      text: 'Logout',
      iconCss: 'e-icons e-logout',
      url: '/logout'
    }
  ];
  
  constructor() {
    console.log('SidebarStandaloneComponent initialized');
  }
  
  toggle() {
    this.sidebarMenuInstance.toggle();
  }
}