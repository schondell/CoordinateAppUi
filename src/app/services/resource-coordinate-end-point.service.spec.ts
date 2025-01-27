import { TestBed } from '@angular/core/testing';

import { ResourceCoordinateRepository } from './resource-coordinate-end-point.service';

describe('ResourceCoordinateRepository', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceCoordinateRepository = TestBed.get(ResourceCoordinateRepository);
    expect(service).toBeTruthy();
  });
});
