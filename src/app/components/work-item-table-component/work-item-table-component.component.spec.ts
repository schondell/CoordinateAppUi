import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemTableComponentComponent } from './work-item-table-component.component';

describe('WorkItemTableComponentComponent', () => {
  let component: WorkItemTableComponentComponent;
  let fixture: ComponentFixture<WorkItemTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkItemTableComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkItemTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
