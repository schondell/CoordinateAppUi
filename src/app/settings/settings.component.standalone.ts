import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.standalone.html',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SettingsStandaloneComponent {
  // Simple static component with no dependencies
  constructor() { 
    console.log('SettingsStandaloneComponent initialized');
  }
}