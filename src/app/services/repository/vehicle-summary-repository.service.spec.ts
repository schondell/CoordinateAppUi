import { TestBed } from '@angular/core/testing';

import { VehicleSummaryRepositoryService } from './vehicle-summary-repository.service';

describe('VehicleSummaryRepositoryService', () => {
  let service: VehicleSummaryRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleSummaryRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
