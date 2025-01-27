import { Component, OnInit, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerWithWorkItemRepository } from '../../services/generated/customerwithworkitem-repository';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { IRouteInput, RouteInput, GeoCoordinate, WayPoint } from '../../models/IRouteInput';
import { OptimizeService } from '../../services/optimize.service';
import { Address, ICustomerWithWorkItemDtoApi} from '../../models/generatedtypes';
import { NotifyService } from '../../services/notify.service';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  constructor(private http: HttpClient,
              private configurations: ConfigurationService,
              private injector: Injector,
              private router: Router,
              private authService: AuthService) { }
  dataSource: CustomerWithWorkItemRepository | null;
  optimizeService: OptimizeService;
  notifyService: NotifyService;

  myBtnClicks$: Observable<any>;

  selectedTab = 0;

  onRouteOptimize() {
      // Initially just get all active workitems
    this.dataSource.getAllCustomerWithWorkItems('', '').subscribe(data => this.optimizeRoute(data));
  }

  onNotify() {
    // Send message to all users
    this.notifyService.postNotification<string>('Test-message hardcoded').subscribe(retstat => this.notifySend(retstat));
  }

  optimizeRoute(customerWithWorkItemDtoApi: ICustomerWithWorkItemDtoApi) {
    const routeInput: IRouteInput = new RouteInput();
    routeInput.StartAddress = new Address();
    routeInput.StartAddress.normalizedAddress = customerWithWorkItemDtoApi.customerWithWorkItemDtos[0].normalizedAddress;
    routeInput.StartAddress.longitude = customerWithWorkItemDtoApi.customerWithWorkItemDtos[0].longitude;
    routeInput.StartAddress.latitude = customerWithWorkItemDtoApi.customerWithWorkItemDtos[0].latitude;
    routeInput.EndAddress = new Address();
    routeInput.EndAddress.normalizedAddress = customerWithWorkItemDtoApi.customerWithWorkItemDtos[customerWithWorkItemDtoApi.customerWithWorkItemDtos.length - 1].normalizedAddress;
    routeInput.EndAddress.longitude = customerWithWorkItemDtoApi.customerWithWorkItemDtos[customerWithWorkItemDtoApi.customerWithWorkItemDtos.length - 1].longitude;
    routeInput.EndAddress.latitude = customerWithWorkItemDtoApi.customerWithWorkItemDtos[customerWithWorkItemDtoApi.customerWithWorkItemDtos.length - 1].latitude;

    routeInput.LastKnownGeoCoordinate = new GeoCoordinate();
    routeInput.WayPoints = new Array<WayPoint>();

    if (customerWithWorkItemDtoApi !== null) {
      if (customerWithWorkItemDtoApi.customerWithWorkItemDtos !== null) {
        let counter = 0;
        for (const i of customerWithWorkItemDtoApi.customerWithWorkItemDtos) {
          const wayPoint = new WayPoint();
          wayPoint.OriginalOrder = counter++;
          wayPoint.Latitude = i.latitude;
          wayPoint.Longitude = i.longitude;
          wayPoint.Address = i.normalizedAddress;
          routeInput.WayPoints.push(wayPoint);
          if (counter > 12) break;
        }

        this.optimizeService.postRouteForOptimization<IRouteInput>(routeInput).subscribe(data => this.updateRoute(data));
      }
    }
  }

  updateRoute(routeInput: IRouteInput) {
  }

  notifySend(reststat: string) {

  }

  ngOnInit() {
    this.dataSource = new CustomerWithWorkItemRepository(this.configurations, this.http, this.authService);
    this.optimizeService = new OptimizeService(this.http, this.configurations, this.injector);
    this.notifyService = new NotifyService(this.configurations, this.http,  this.authService);
  }

  selectTab(event: any): void {
    this.selectedTab = event.selectedIndex;
    switch (this.selectedTab) {
      case 0:
        this.router.navigate(['/map-overview']);
        break;
      case 1:
        this.router.navigate(['/route-planning']);
        break;
      case 2:
        this.router.navigate(['/all-workitems']);
        break;
    }
  }
    // selectTab(event) {
    //   this.selectedTab = event;
    //   }
}
