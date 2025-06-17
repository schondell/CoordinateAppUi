import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from './endpoint-base.service';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { Country } from '../models/country.model';
import { Group } from '../models/group.model';
import { Address } from '../models/address.model';
import { GpsTrackerType } from '../models/gpstrackertype.model';
import { MobileSetting } from '../models/mobilesetting.model';
import { NetworkOperator } from '../models/networkoperator.model';
import { Vehicle } from '../models/vehicle.model';
import { SimCard } from '../models/simcard.model';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService extends EndpointBase {
  private readonly baseApiUrl: string;
  
  // BehaviorSubjects for caching reference data
  private countries$ = new BehaviorSubject<Country[]>([]);
  private groups$ = new BehaviorSubject<Group[]>([]);
  private addresses$ = new BehaviorSubject<Address[]>([]);
  private gpsTrackerTypes$ = new BehaviorSubject<GpsTrackerType[]>([]);
  private mobileSettings$ = new BehaviorSubject<MobileSetting[]>([]);
  private networkOperators$ = new BehaviorSubject<NetworkOperator[]>([]);
  private vehicles$ = new BehaviorSubject<Vehicle[]>([]);
  private simCards$ = new BehaviorSubject<SimCard[]>([]);
  private customers$ = new BehaviorSubject<Customer[]>([]);

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    authService: AuthService
  ) {
    super(http, authService);
    this.baseApiUrl = configurations.baseUrl + '/api/';
  }

  // Countries
  getCountries(): Observable<Country[]> {
    if (this.countries$.value.length === 0) {
      this.loadCountries();
    }
    return this.countries$.asObservable();
  }

  private loadCountries(): void {
    const endpointUrl = `${this.baseApiUrl}countries`;
    this.http.get<Country[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (countries) => this.countries$.next(countries),
      error: (error) => console.error('Error loading countries:', error)
    });
  }

  // Groups
  getGroups(): Observable<Group[]> {
    if (this.groups$.value.length === 0) {
      this.loadGroups();
    }
    return this.groups$.asObservable();
  }

  private loadGroups(): void {
    const endpointUrl = `${this.baseApiUrl}groups`;
    this.http.get<Group[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (groups) => this.groups$.next(groups),
      error: (error) => console.error('Error loading groups:', error)
    });
  }

  // Addresses
  getAddresses(): Observable<Address[]> {
    if (this.addresses$.value.length === 0) {
      this.loadAddresses();
    }
    return this.addresses$.asObservable();
  }

  private loadAddresses(): void {
    const endpointUrl = `${this.baseApiUrl}addresses`;
    this.http.get<Address[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (addresses) => this.addresses$.next(addresses),
      error: (error) => console.error('Error loading addresses:', error)
    });
  }

  // GPS Tracker Types
  getGpsTrackerTypes(): Observable<GpsTrackerType[]> {
    if (this.gpsTrackerTypes$.value.length === 0) {
      this.loadGpsTrackerTypes();
    }
    return this.gpsTrackerTypes$.asObservable();
  }

  private loadGpsTrackerTypes(): void {
    const endpointUrl = `${this.baseApiUrl}GpsTrackerType`;
    this.http.get<GpsTrackerType[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (types) => this.gpsTrackerTypes$.next(types),
      error: (error) => console.error('Error loading GPS tracker types:', error)
    });
  }

  // Mobile Settings
  getMobileSettings(): Observable<MobileSetting[]> {
    if (this.mobileSettings$.value.length === 0) {
      this.loadMobileSettings();
    }
    return this.mobileSettings$.asObservable();
  }

  private loadMobileSettings(): void {
    const endpointUrl = `${this.baseApiUrl}MobileSetting`;
    this.http.get<MobileSetting[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (settings) => this.mobileSettings$.next(settings),
      error: (error) => console.error('Error loading mobile settings:', error)
    });
  }

  // Network Operators
  getNetworkOperators(): Observable<NetworkOperator[]> {
    if (this.networkOperators$.value.length === 0) {
      this.loadNetworkOperators();
    }
    return this.networkOperators$.asObservable();
  }

  private loadNetworkOperators(): void {
    const endpointUrl = `${this.baseApiUrl}NetworkOperator`;
    console.log('ReferenceDataService: Loading NetworkOperators from:', endpointUrl);
    this.http.get<NetworkOperator[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (operators) => {
        console.log('ReferenceDataService: NetworkOperators response:', operators);
        this.networkOperators$.next(operators);
      },
      error: (error) => console.error('Error loading network operators:', error)
    });
  }

  // Vehicles (for GPS tracker assignment)
  getVehicles(): Observable<Vehicle[]> {
    if (this.vehicles$.value.length === 0) {
      this.loadVehicles();
    }
    return this.vehicles$.asObservable();
  }

  private loadVehicles(): void {
    const endpointUrl = `${this.baseApiUrl}Vehicle`;
    this.http.get<Vehicle[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (vehicles) => this.vehicles$.next(vehicles),
      error: (error) => console.error('Error loading vehicles:', error)
    });
  }

  // SIM Cards (for GPS tracker assignment)
  getSimCards(): Observable<SimCard[]> {
    if (this.simCards$.value.length === 0) {
      this.loadSimCards();
    }
    return this.simCards$.asObservable();
  }

  private loadSimCards(): void {
    const endpointUrl = `${this.baseApiUrl}SimCard`;
    this.http.get<SimCard[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (simCards) => this.simCards$.next(simCards),
      error: (error) => console.error('Error loading SIM cards:', error)
    });
  }

  // Customers (for parent customer selection)
  getCustomers(): Observable<Customer[]> {
    if (this.customers$.value.length === 0) {
      this.loadCustomers();
    }
    return this.customers$.asObservable();
  }

  private loadCustomers(): void {
    const endpointUrl = `${this.baseApiUrl}Customer`;
    this.http.get<Customer[]>(endpointUrl, this.getRequestHeaders()).subscribe({
      next: (customers) => this.customers$.next(customers),
      error: (error) => console.error('Error loading customers:', error)
    });
  }

  // Helper methods to get display names
  getCountryName(countryId: number): Observable<string> {
    return this.getCountries().pipe(
      map(countries => countries.find(c => c.id === countryId)?.name || `Country ${countryId}`)
    );
  }

  getGroupName(groupId: number): Observable<string> {
    return this.getGroups().pipe(
      map(groups => groups.find(g => g.id === groupId)?.name || `Group ${groupId}`)
    );
  }

  getAddressName(addressId: number): Observable<string> {
    return this.getAddresses().pipe(
      map(addresses => addresses.find(a => a.id === addressId)?.name || `Address ${addressId}`)
    );
  }

  getNetworkOperatorName(operatorId: number): Observable<string> {
    return this.getNetworkOperators().pipe(
      map(operators => operators.find(o => o.id === operatorId)?.name || `Operator ${operatorId}`)
    );
  }

  getVehicleName(vehicleId: number): Observable<string> {
    return this.getVehicles().pipe(
      map(vehicles => vehicles.find(v => v.id === vehicleId)?.name || `Vehicle ${vehicleId}`)
    );
  }

  getSimCardName(simCardId: number): Observable<string> {
    return this.getSimCards().pipe(
      map(simCards => simCards.find(s => s.id === simCardId)?.name || `SIM ${simCardId}`)
    );
  }

  getCustomerName(customerId: number): Observable<string> {
    return this.getCustomers().pipe(
      map(customers => customers.find(c => c.id === customerId)?.name || `Customer ${customerId}`)
    );
  }

  // Refresh methods to reload data when needed
  refreshCountries(): void {
    this.loadCountries();
  }

  refreshGroups(): void {
    this.loadGroups();
  }

  refreshAddresses(): void {
    this.loadAddresses();
  }

  refreshNetworkOperators(): void {
    this.loadNetworkOperators();
  }

  refreshVehicles(): void {
    this.loadVehicles();
  }

  refreshSimCards(): void {
    this.loadSimCards();
  }

  refreshCustomers(): void {
    this.loadCustomers();
  }
}