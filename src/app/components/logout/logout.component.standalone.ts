import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-standalone',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './logout.component.standalone.html',
  styleUrls: ['./logout.component.standalone.scss']
})
export class LogoutStandaloneComponent implements OnInit {
  constructor(private authService: AuthService) {
    console.log('LogoutStandaloneComponent initialized');
  }

  ngOnInit() {
    setTimeout(() => {
      this.authService.logout();
      this.authService.redirectLogoutUser();
    }, 1000);
  }
}