import { TestBed } from '@angular/core/testing';

import { VehicleSummaryService } from './vehicle-summary.service';

describe('VehicleSummaryService', () => {
  let service: VehicleSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
