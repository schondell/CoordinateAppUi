export class vehicleJournal {
  vehicleId: number;
  started: string;
  ended: string;
  distance: number;
  odometerStart: number;
  odometerEnd: number;
  vehicleTripTypeId: number | null;
  note: string | null;
  addressIdStart: number;
  addressIdEnd: number;
  startAddressName: string;
  endAddressName: string;
  purposeOfTrip: string | null;
  driver: string | null;
  vehicleTripLogId: number;
  driverId: number;

  constructor(
      vehicleId: number,
      started: string,
      ended: string,
      distance: number,
      odometerStart: number,
      odometerEnd: number,
      vehicleTripTypeId: number | null,
      note: string | null,
      addressIdStart: number,
      addressIdEnd: number,
      startAddressName: string,
      endAddressName: string,
      purposeOfTrip: string | null,
      driver: string | null,
      vehicleTripLogId: number,
      driverId: number
  ) {
    this.vehicleId = vehicleId;
    this.started = started;
    this.ended = ended;
    this.distance = distance;
    this.odometerStart = odometerStart;
    this.odometerEnd = odometerEnd;
    this.vehicleTripTypeId = vehicleTripTypeId;
    this.note = note;
    this.addressIdStart = addressIdStart;
    this.addressIdEnd = addressIdEnd;
    this.startAddressName = startAddressName;
    this.endAddressName = endAddressName;
    this.purposeOfTrip = purposeOfTrip;
    this.driver = driver;
    this.vehicleTripLogId = vehicleTripLogId;
    this.driverId = driverId;
  }
}
