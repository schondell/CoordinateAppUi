import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fadeInOut } from '../../services/animations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { PageHeaderStandaloneComponent } from '../../shared/page-header/page-header.component.standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TranslateModule,
    PageHeaderStandaloneComponent
  ],
  templateUrl: './about.component.standalone.html',
  styleUrls: ['./about.component.standalone.scss'],
  animations: [fadeInOut]
})
export class AboutStandaloneComponent {}