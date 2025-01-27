import { IVehicleTripLogFullDtoApi } from "./generatedtypes";

export class TripHistoryEntry {
  groupName: string;
  totalDistance: number;
  totalFuel: number;
  vehicleTripLogFullDtoApis: IVehicleTripLogFullDtoApi[];
}
