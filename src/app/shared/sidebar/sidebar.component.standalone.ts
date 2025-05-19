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
  templateUrl: './sidebar.component.standalone.html',
  styleUrls: ['./sidebar.component.standalone.scss']
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