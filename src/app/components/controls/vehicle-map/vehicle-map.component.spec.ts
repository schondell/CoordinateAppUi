import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehicleMapComponent } from './vehicle-map.component';

describe('VehicheMapComponent', () => {
  let component: VehicleMapComponent;
  let fixture: ComponentFixture<VehicleMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
