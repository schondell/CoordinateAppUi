
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemComponent } from './workitem.component';

describe('WorkItemComponent', () => {
  let component: WorkItemComponent;
  let fixture: ComponentFixture<WorkItemComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
