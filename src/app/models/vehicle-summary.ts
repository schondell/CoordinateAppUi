export class VehicleSummary {
  tenantId: number;
  vehicleId: number;
  name: string;
  model: string;
  modelYear: number;
  make: string;
  sinoCastelObd2AlarmId: string;
  deviceIdentity: string;
  messageTypeStrong: number;
  description: string;
  longitude: number;
  latitude: number;
  geoHash: string;
  speed: number;
  heading: number;
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
}
