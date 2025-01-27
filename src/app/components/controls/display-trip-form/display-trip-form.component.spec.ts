import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisplayTripFormComponent } from './display-trip-form.component';

describe('DisplayTripFormComponent', () => {
  let component: DisplayTripFormComponent;
  let fixture: ComponentFixture<DisplayTripFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayTripFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTripFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
