import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateVehicleSelectorComponent } from './date-vehicle-selector.component';

describe('DateVehicleSelectorComponent', () => {
  let component: DateVehicleSelectorComponent;
  let fixture: ComponentFixture<DateVehicleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateVehicleSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateVehicleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
