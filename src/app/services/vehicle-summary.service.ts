import {Injectable} from "@angular/core";
import {VehicleSummary} from "../models/vehicle-summary";

@Injectable({ providedIn: 'root' })
export class VehicleSummaryService {
  private vehicleSummaries = new Map<string, VehicleSummary>();

  update(vehicleSummary: VehicleSummary): void {
    const compositeKey = `${vehicleSummary.vehicleId}`;
    this.vehicleSummaries.set(compositeKey, vehicleSummary);
  }

  get(vehicleId: number): VehicleSummary | undefined {
    const compositeKey = `${vehicleId}`;
    return this.vehicleSummaries.get(compositeKey);
  }

  getAll(): VehicleSummary[] {
    return Array.from(this.vehicleSummaries.values());
  }

  add(vehicleSummaries: VehicleSummary[]): void {
    vehicleSummaries.forEach(summary => this.update(summary));
  }
}
