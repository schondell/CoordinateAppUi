import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService ) {
  }

  ngOnInit() {
    // Your initialization logic here

    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

}
