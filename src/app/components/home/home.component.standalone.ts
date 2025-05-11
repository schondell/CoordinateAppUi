import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Syncfusion components
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
// Custom components
import { PageHeaderStandaloneComponent } from '../../shared/page-header/page-header.component.standalone';

@Component({
  selector: 'app-home-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TabModule,
    ButtonModule,
    PageHeaderStandaloneComponent
  ],
  templateUrl: './home.component.standalone.html',
  styleUrls: ['./home.component.standalone.scss']
})
export class HomeStandaloneComponent {
  selectedTab = 0;
  
  constructor(private router: Router) {
    console.log('HomeStandaloneComponent initialized');
  }
  
  selectTab(event: any): void {
    this.selectedTab = event.selectedIndex;
    // We're just demonstrating the tab selection without actual navigation
    console.log('Selected tab:', this.selectedTab);
  }
}