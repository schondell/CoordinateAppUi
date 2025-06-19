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
    if (!token) {
      console.warn('Cannot start SignalR connection without a valid token');
      return;
    }

    try {
      // Ensure that an old connection is not alive before starting a new one.
      if (this.hubConnection) {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
          console.log('Stopping existing SignalR connection before starting new one');
          this.hubConnection.stop();
        } else if (this.hubConnection.state === signalR.HubConnectionState.Connecting || 
                  this.hubConnection.state === signalR.HubConnectionState.Reconnecting) {
          console.log('Connection is currently in connecting/reconnecting state, waiting to complete');
          return;
        }
      }

      console.log('Building new SignalR connection with auth token');
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.configurations.baseUrl + '/hubs/geoCoordHub', {
          accessTokenFactory: () => token,
          withCredentials: false
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // Reconnect with increasing delays
        .build();

      // Set up event handlers before starting connection
      // Event triggers whenever the client is attempting to reconnect.
      this.hubConnection.onreconnecting((error) => {
        console.warn(`SignalR connection lost due to error: "${error}". Attempting to reconnect...`);
      });

      // Event triggers if the client successfully reconnects.
      this.hubConnection.onreconnected((connectionId) => {
        console.log(`SignalR connection reestablished. Connected with connectionId "${connectionId}"`);

        // Fetch the fresh token
        const freshToken = this.authService.accessToken;
        
        // Only restart if the token has changed
        if (freshToken !== token) {
          console.log('Auth token has changed, restarting SignalR connection');
          this.startConnection(freshToken);
        }
      });
      
      // Event triggers if the client disconnects
      this.hubConnection.onclose((error) => {
        console.warn(`SignalR connection closed${error ? ' with error: ' + error : ''}`);
        
        // Check if we have a token and try to reconnect after a delay
        setTimeout(() => {
          const currentToken = this.authService.accessToken;
          if (currentToken && this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Connected) {
            console.log('Attempting to reestablish closed SignalR connection');
            this.startConnection(currentToken);
          }
        }, 5000);
      });
      
      // Register event handlers for specific methods
      this.hubConnection.on('notifyVehicleSummaryChange', (vehicleId: number, vehicleSummary: any) => {
        console.log('Received vehicle summary change notification for vehicle:', vehicleId);
        this.onDataReceived.emit({vehicleId, vehicleSummary});
      });

      // Start the connection
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started successfully');
        })
        .catch(err => {
          console.error('Error starting SignalR connection:', err);
          // Try to reconnect after a delay if the connection fails
          setTimeout(() => {
            if (this.authService.isLoggedIn) {
              console.log('Retrying SignalR connection...');
              this.startConnection(this.authService.accessToken);
            }
          }, 5000);
        });
    } catch (error) {
      console.error('Error in SignalR startConnection:', error);
    }
  }

  // public addVehicleSummaryChangeListener = (methodName: string) => {
  //   this.hubConnection.on(methodName, (vehicleId: number, vehicleSummary: VehicleSummary) => {
  //     // do something with vehicleId and vehicleSummary parameters
  //     this.onDataReceived.emit({ vehicleId, vehicleSummary });
  //   });
  // }
}
