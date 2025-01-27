import { VehicleTripLogFullDto } from './generatedtypes';
export class TripHistoryModel {
  public month: TripHistoryEntryGroup;
}

export class TripHistoryEntryGroup {
  public groupName: string;
  public  groupDate: Date;
  public totalDistance: number;
  public totalFuel: number;
  public totalDuration: number;
  public numberOfTrips: number;
  public tripHistoryEntries: TripHistoryEntry[];
}

export class TripHistoryEntry {
  public groupName: string;
  public  groupDate: Date;
  public totalDistance: number;
  public totalFuel: number;
  public totalDuration: number;
  public numberOfTrips: number;
  public vehicleTripLogFullDtos: VehicleTripLogFullDto[];
}
