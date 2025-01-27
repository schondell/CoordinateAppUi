import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayTripFormService {
  private closeAllSource = new Subject<void>();

  // Observable to be subscribed to by components
  closeAll$ = this.closeAllSource.asObservable();

  // Method to close all components
  closeAll() {
    this.closeAllSource.next();
  }
}
