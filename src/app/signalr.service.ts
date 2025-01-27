import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {ConfigurationService} from "./services/configuration.service";
import {VehicleSummary} from "./models/vehicle-summary";
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  constructor(
  private configurations: ConfigurationService,
  private authService: AuthService   // inject AuthService
  ) {}

  hubConnection: signalR.HubConnection;

  // Declare the EventEmitter
  public onDataReceived = new EventEmitter<any>();

  public startConnection = (token: string) => {

    // Ensure that an old connection is not alive before starting a new one.
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.configurations.baseUrl + '/hubs/geoCoordHub', {
        accessTokenFactory: () => token,
      })
      .build();

    this.hubConnection
      .start()
      .then(
        () => console.log('Connection started')
      )
      .catch(err => console.log('Error while starting connection: ' + err));

    // Event triggers whenever the client is attempting to reconnect.
    this.hubConnection.onreconnecting((error) => {
      console.assert(this.hubConnection.state === signalR.HubConnectionState.Reconnecting);
      console.assert(error instanceof Error);

      console.log(`Connection lost due to error "${error}". Reconnecting.`);
    });


    // Event triggers if the client successfully reconnects.
    this.hubConnection.onreconnected((connectionId) => {
      console.assert(this.hubConnection.state === signalR.HubConnectionState.Connected);
      console.assert(connectionId === this.hubConnection.connectionId);

      console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);

      // Fetch the fresh token
      const freshToken = this.authService.accessToken;

      // Restart the connection with a new token
      this.startConnection(freshToken);
    });
  }

  // public addVehicleSummaryChangeListener = (methodName: string) => {
  //   this.hubConnection.on(methodName, (vehicleId: number, vehicleSummary: VehicleSummary) => {
  //     // do something with vehicleId and vehicleSummary parameters
  //     this.onDataReceived.emit({ vehicleId, vehicleSummary });
  //   });
  // }
}
