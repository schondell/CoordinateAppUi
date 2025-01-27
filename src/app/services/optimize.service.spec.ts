import { TestBed } from '@angular/core/testing';

import { OptimizeService } from './optimize.service';

describe('OptimizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OptimizeService = TestBed.get(OptimizeService);
    expect(service).toBeTruthy();
  });
});
