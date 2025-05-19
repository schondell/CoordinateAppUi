import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginControlStandaloneComponent } from './login-control.component.standalone';
// Syncfusion components
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-login-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LoginControlStandaloneComponent,
    ButtonModule
  ],
  templateUrl: './login.component.standalone.html',
  styleUrls: ['./login.component.standalone.scss']
})
export class LoginStandaloneComponent {
  @ViewChild(LoginControlStandaloneComponent, { static: true })
  loginControl: LoginControlStandaloneComponent;
  
  constructor() {
    console.log('LoginStandaloneComponent initialized');
  }
}