import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [fadeInOut],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})

export class OverviewComponent {
    constructor(public configurations: ConfigurationService) {
    }
}
