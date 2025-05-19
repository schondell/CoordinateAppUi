import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavStandaloneComponent } from './admin-nav/admin-nav.component.standalone';

@Component({
  selector: 'app-admin-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminNavStandaloneComponent
  ],
  templateUrl: './admin.component.standalone.html',
  styleUrls: ['./admin.component.standalone.scss']
})
export class AdminStandaloneComponent {
  constructor() {
    console.log('AdminStandaloneComponent initialized');
  }
}