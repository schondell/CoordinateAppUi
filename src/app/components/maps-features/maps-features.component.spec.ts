import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsFeaturesComponent } from './maps-features.component';

describe('MapsFeaturesComponent', () => {
  let component: MapsFeaturesComponent;
  let fixture: ComponentFixture<MapsFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
