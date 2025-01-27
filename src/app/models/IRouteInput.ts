import { TimeSpan } from '../shared/timespan';
import { Address } from "./generatedtypes";

export interface IGeoCoordinate {
  GeoCoordinateId: number;
  UserId: number;
  RouteNo: number;
  UserName: string;
  ClientNo: string;
  IpAddress: string;
  EventNo: number;
  Longitude: number;
  Latitude: number;
  Altitude: number;
  Speed: number;
  Heading: number;
  Created: string;
  Modified: string;
  DrivingInfo: string;
  GeoHash: string;
  IsDirty: boolean;
}

export class GeoCoordinate implements IGeoCoordinate {
  GeoCoordinateId: number;
  UserId: number;
  RouteNo: number;
  UserName: string;
  ClientNo: string;
  IpAddress: string;
  EventNo: number;
  Longitude: number;
  Latitude: number;
  Altitude: number;
  Speed: number;
  Heading: number;
  Created: string;
  Modified: string;
  DrivingInfo: string;
  GeoHash: string;
  IsDirty: boolean;
}

export interface IWayPoint {
  Address: string;
  Latitude: number;
  Longitude: number;
  OptimizedOrder: number;
  OriginalOrder: number;
  WorkItemId: number;
}

export class WayPoint implements IWayPoint {
  Address: string;
  Latitude: number;
  Longitude: number;
  OptimizedOrder: number;
  OriginalOrder: number;
  WorkItemId: number;
}

export interface IRouteInput {
  UserId: number;
  EndAddress: Address;
  StartAddress: Address;
  WayPoints: IWayPoint[];
  LastKnownGeoCoordinate: IGeoCoordinate;
  LicenseKey: string;
}

export interface IRouteResponse {
    wayPoints: string;
    distance: number;
    duration: number;
}

export class RouteInput implements IRouteInput {
  UserId: number;
  EndAddress: Address;
  StartAddress: Address;
  WayPoints: WayPoint[];
  LastKnownGeoCoordinate: GeoCoordinate;
  LicenseKey: string;
}

export interface IDrivingInfo {
  schemaVersion: string;
  speed: number;
  isIdling: boolean;
  isIdlingSince: Date;
  isDrivingSince: Date;
  timeStamp: Date;
  highestSpeed: number;
  altitude: number;
  distance: number;
  obd2Distance: number;
  totalDrivingTime: TimeSpan;
  totalIdlingTime: TimeSpan;
  lastLocation: string;
  encodedPath: string;
  lastPathSegment: string;
  timeZone: string;
  timeOfFirstEvent: Date;
  deviceId: string;
}

export class DrivingInfo implements IDrivingInfo {
  schemaVersion: string;
  speed: number;
  isIdling: boolean;
  isIdlingSince: Date;
  isDrivingSince: Date;
  timeStamp: Date;
  highestSpeed: number;
  altitude: number;
  distance: number;
  obd2Distance: number;
  totalDrivingTime: TimeSpan;
  totalIdlingTime: TimeSpan;
  lastLocation: string;
  encodedPath: string;
  lastPathSegment: string;
  timeZone: string;
  timeOfFirstEvent: Date;
  deviceId: string;
}

export class SinoCastelLocationEventDto2 {
  sinoCastelLocationEventId: number;
  VehicleId: number;
  deviceIdentity: string;
  eventNo: number;
  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;
  heading: number;
  deviceTimestamp: Date;
  created: Date;
  modified: Date;
  DrivingInfo: string;
  geoHash: string;
}

export class SinoCastelObd2AlarmDto2 {
  sinoCastelObd2AlarmId: number;
  VehicleId: number;
  deviceIdentity: string;
  deviceEventTypeId: number;
  vIN: string;
  ipAddress: string;
  Longitude: number;
  Latitude: number;
  geoHash: string;
  speed: number;
  heading: number;
  latestAccOnTime: Date;
  totalTripMilage: number;
  currentTripMileage: number;
  totalFuelConsumption: number;
  currentTripFuelConsumption: number;
  Alarm: string;
  deviceTimestamp: Date;
  created: Date;
  modified: Date;
  correlationIdentity: string;
  raw: string;
}

interface Polyline {
  decode(string: string, precision?: number): number[][];
  encode(coordinate: number[][], precision?: number): string;
  //fromGeoJSON(geojson: GeoJSON.LineString | GeoJSON.Feature<GeoJSON.LineString>, precision?: number): string;
}


export class  TripResponse {
    wayPoints: string;
    totalCount: number;
    maxLat: number;
    minLat: number;
    maxLon: number;
    minLon: number;
    startAddress: number;
    endAddress: number;
}

