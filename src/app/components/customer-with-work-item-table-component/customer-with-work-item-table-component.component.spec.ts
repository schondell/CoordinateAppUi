import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWithWorkItemTableComponentComponent } from './customer-with-work-item-table-component.component';

describe('CustomerWithWorkItemTableComponentComponent', () => {
  let component: CustomerWithWorkItemTableComponentComponent;
  let fixture: ComponentFixture<CustomerWithWorkItemTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerWithWorkItemTableComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerWithWorkItemTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
