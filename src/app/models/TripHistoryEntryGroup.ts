import { IVehicleTripLogFullDtoApi } from "./generatedtypes";
import { TripHistoryEntry } from "./TripHistoryEntry";

export class TripHistoryEntryGroup {
  groupName: string;
  totalDistance: number;
  totalFuel: number;
    vehicleTripLogFullDtoApis: TripHistoryEntry[];
}
