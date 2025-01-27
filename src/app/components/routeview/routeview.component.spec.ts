import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouteviewComponent } from './routeview.component';

describe('RouteviewComponent', () => {
  let component: RouteviewComponent;
  let fixture: ComponentFixture<RouteviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
