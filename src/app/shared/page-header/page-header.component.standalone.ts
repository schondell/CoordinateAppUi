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
  template: `
    <header class="page-header">
      <span class="icon">{{iconEmoji}}</span>
      <h2>{{title}}</h2>
    </header>
  `,
  styles: [`
    .page-header {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .page-header h2 {
      margin: 0;
      font-weight: 500;
      color: var(--app-primary-color, #3f51b5);
      font-size: 1.5rem;
    }
    
    .icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }
  `]
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