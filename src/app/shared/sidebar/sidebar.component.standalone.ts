import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion components
import { SidebarComponent as EjsSidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { SyncfusionModules } from '../syncfusion-standalone';

interface MenuItem {
  text: string;
  iconCss: string;
  url?: string;
  items?: MenuItem[];
}

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
  
  // User information
  @Input() userName = 'John Doe';
  @Input() userRole = 'Administrator';

  // Menu items - we'll directly use these instead of categorizing
  @Input() menuItems: MenuItem[] = [];

  // For backward compatibility
  navigationItems: MenuItem[] = [];
  managementItems: MenuItem[] = [];
  systemItems: MenuItem[] = [];

  // Computed user initials for avatar
  get userInitials(): string {
    if (!this.userName) return '';
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substr(0, 2)
      .toUpperCase();
  }

  activeMenuItem: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Add diagnostic logging
    console.log('Menu items received in sidebar component:', this.menuItems);

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
    if (!this.menuItems || this.menuItems.length === 0) return;
    const findMatchingItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.url && url.startsWith(item.url)) {
          return item;
        }
        if (item.items && item.items.length > 0) {
          const match = findMatchingItem(item.items);
          if (match) return match;
        }
      }
      return undefined;
    };

    const foundItem = findMatchingItem(this.menuItems);

    if (foundItem && foundItem.url) {
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
    if (!url) return false;
    return this.router.url.startsWith(url);
  }
}
