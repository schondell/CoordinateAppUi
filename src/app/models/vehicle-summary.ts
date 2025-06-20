export interface SinoCastelObd2AlarmTableEntity {
  messageTypeStrong: number;
  longitude: number;
  latitude: number;
  [key: string]: any;
}

export class VehicleSummary {
  tenantId: number;
  vehicleId: number;
  name: string;
  model: string;
  modelYear: number;
  make: string;
  polyLineRoute: string;

  // Current position properties (from last known position)
  currentLatitude: number;
  currentLongitude: number;
  currentSpeed: number;
  currentHeading: number;

  alarms: SinoCastelObd2AlarmTableEntity[];
  sinoCastelObd2AlarmId: string;
  deviceIdentity: string;
  messageTypeStrong: number;
  description: string;
  geoHash: string;
  latestAccOnTime: Date;
  totalTripMileage: number;
  currentTripMileage: number;
  totalFuelConsumption: number;
  currentTripFuelConsumption: number;
  alarm: string;
  deviceTimestamp: Date;
  correlationIdentity: string;
  day: number;
  month: number;
  year: number;

  constructor() {
    this.alarms = [];
  }
}
