import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingJournalTableComponent } from './driving-journal-table.component';

describe('DrivingJournalTableComponent', () => {
  let component: DrivingJournalTableComponent;
  let fixture: ComponentFixture<DrivingJournalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingJournalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingJournalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
