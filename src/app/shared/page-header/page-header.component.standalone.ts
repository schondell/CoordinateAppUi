import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header-standalone',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './page-header.component.standalone.html',
  styleUrls: ['./page-header.component.standalone.scss']
})
export class PageHeaderStandaloneComponent {
  @Input() title: string = 'Page Title';
  @Input() icon: string = 'default';
  
  constructor() {
    console.log('PageHeaderStandaloneComponent initialized');
  }
  
  get iconEmoji(): string {
    // Map common icons to emojis
    const iconMap: {[key: string]: string} = {
      'dashboard': '📊',
      'home': '🏠',
      'settings': '⚙️',
      'users': '👥',
      'user': '👤',
      'admin': '🔑',
      'roles': '🔖',
      'login': '🔒',
      'about': 'ℹ️',
      'default': '📄'
    };
    
    return iconMap[this.icon] || iconMap['default'];
  }
}