import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingJournalEditComponent } from './driving-journal-edit.component';

describe('DrivingJournalEditComponent', () => {
  let component: DrivingJournalEditComponent;
  let fixture: ComponentFixture<DrivingJournalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrivingJournalEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrivingJournalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
