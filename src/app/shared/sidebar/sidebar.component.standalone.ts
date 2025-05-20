import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion components
import { SidebarComponent as EjsSidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { SyncfusionModules } from '../syncfusion-standalone';

@Component({
  selector: 'app-sidebar-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ...SyncfusionModules
  ],
  templateUrl: './sidebar.component.standalone.html',
  styleUrls: ['./sidebar.component.standalone.scss']
})
export class SidebarStandaloneComponent implements OnInit {
  @ViewChild('sidebarMenuInstance') sidebarMenuInstance: EjsSidebarComponent;
  
  @Input() enableDock = true;
  @Input() dockSize = '60px';
  @Input() width = '240px';
  @Input() target = '.main-content';
  @Input() isOpen = true;
  @Input() isSidebarCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  
  @Input() menuItems = [
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
      url: '/data-management'
    },
    {
      text: 'Settings',
      iconCss: 'e-icons e-settings',
      url: '/settings'
    },
    {
      text: 'Admin',
      iconCss: 'e-icons e-admin',
      url: '/admin'
    },
    {
      text: 'mainMenu.About',
      iconCss: 'e-icons e-info',
      url: '/about'
    },
    {
      text: 'Logout',
      iconCss: 'e-icons e-logout',
      url: '/logout'
    }
  ];
  
  activeMenuItem: string = '';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Set the active menu item based on the current route
    this.setActiveMenuItem(this.router.url);
    
    // Update active menu item when route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenuItem(event.url);
      }
    });
  }
  
  setActiveMenuItem(url: string) {
    // Find the matching menu item for the current URL
    const foundItem = this.menuItems.find(item => 
      url.startsWith(item.url) || 
      (item.url === '/home' && url === '/')
    );
    
    if (foundItem) {
      this.activeMenuItem = foundItem.url;
    }
  }
  
  toggle() {
    this.sidebarMenuInstance.toggle();
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.collapsedChange.emit(this.isSidebarCollapsed);
  }
  
  // Check if a menu item is active
  isActive(url: string): boolean {
    return this.activeMenuItem === url;
  }
}