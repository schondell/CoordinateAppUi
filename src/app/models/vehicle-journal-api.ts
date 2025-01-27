import {vehicleJournal} from "./vehicle-journal";

export class VehicleJournalApi {
  vehicleJournals: vehicleJournal[];
  vehicleName: string;
  registrationNo: string;
  firstOdometerStart: number;

  constructor(
      vehicleJournals: vehicleJournal[],
      vehicleName: string,
      registrationNo: string,
      firstOdometerStart: number
  ) {
    this.vehicleJournals = vehicleJournals;
    this.vehicleName = vehicleName;
    this.registrationNo = registrationNo;
    this.firstOdometerStart = firstOdometerStart;
  }
}