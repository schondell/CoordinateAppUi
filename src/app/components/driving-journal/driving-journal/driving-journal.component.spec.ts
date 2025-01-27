import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingJournalComponent } from './driving-journal.component';

describe('DrivingJournalComponent', () => {
  let component: DrivingJournalComponent;
  let fixture: ComponentFixture<DrivingJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
