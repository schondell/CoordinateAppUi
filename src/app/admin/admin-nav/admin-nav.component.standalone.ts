import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-nav.component.standalone.html',
  styleUrls: ['./admin-nav.component.standalone.scss']
})
export class AdminNavStandaloneComponent {
  constructor() {
    console.log('AdminNavStandaloneComponent initialized');
  }
}