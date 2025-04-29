import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role-list-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './role-list.component.standalone.html',
  styleUrls: ['./role-list.component.standalone.scss']
})
export class RoleListStandaloneComponent {
  constructor() {
    console.log('RoleListStandaloneComponent initialized');
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filtering by:', filterValue);
    // In a real component, this would filter the data source
  }
  
  addRole() {
    console.log('Add new role clicked');
    // In a real component, this would open a dialog or navigate to a create form
  }
}