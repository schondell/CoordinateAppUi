export class vehicleJournalSummaryDto {
  vehicleName: string;
  registrationNo: string;
  firstOdometerStart: number;

  constructor(vehicleName: string, registrationNo: string, firstOdometerStart: number) {
    this.vehicleName = vehicleName;
    this.registrationNo = registrationNo;
    this.firstOdometerStart = firstOdometerStart;
  }
}
