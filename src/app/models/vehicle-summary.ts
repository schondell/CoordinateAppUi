export interface SinoCastelObd2AlarmTableEntity {
  partitionKey: string;
  rowKey: string;
  timestamp: string;
  sinoCastelObd2AlarmId: number;
  deviceIdentity: string;
  messageTypeStrong: number;
  description: string;
  longitude: number;
  latitude: number;
  geoHash: string | null;
  speed: number;
  heading: number;
  latestAccOnTime: string;
  totalTripMileage: number;
  currentTripMileage: number;
  totalFuelConsumption: number;
  currentTripFuelConsumption: number;
  alarm: string;
  deviceTimestamp: string;
  correlationIdentity: string | null;
  day: number;
  month: number;
  year: number;
}

export class VehicleSummary {
  tenantId: number;
  vehicleId: number;
  name: string;
  model: string;
  modelYear: number;
  make: string;
  polyLineRoute: string;
  alarms: SinoCastelObd2AlarmTableEntity[];

  get latitude(): number {
    return this.alarms && this.alarms.length > 0 ? this.alarms[0].latitude : 0;
  }

  get longitude(): number {
    return this.alarms && this.alarms.length > 0 ? this.alarms[0].longitude : 0;
  }

  get speed(): number {
    return this.alarms && this.alarms.length > 0 ? this.alarms[0].speed || 0 : 0;
  }

  get deviceTimestamp(): Date {
    if (this.alarms && this.alarms.length > 0) {
      return new Date(this.alarms[0].deviceTimestamp);
    }
    return new Date();
  }

  get heading(): number {
    return this.alarms && this.alarms.length > 0 ? this.alarms[0].heading || 0 : 0;
  }

  constructor() {
    this.alarms = [];
  }
}
