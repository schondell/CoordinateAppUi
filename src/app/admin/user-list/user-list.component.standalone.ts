import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.standalone.html',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class UserListStandaloneComponent {
  // Simple static component with no dependencies
  constructor() {
    console.log('UserListStandaloneComponent initialized');
  }
}