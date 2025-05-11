import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-editor',
  templateUrl: './role-editor.component.standalone.html',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class RoleEditorStandaloneComponent {
  // Simple static component with no dependencies
  constructor() {
    console.log('RoleEditorStandaloneComponent initialized');
  }
}