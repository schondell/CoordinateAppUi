




import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent, FooterModule } from './footer.component';

describe('Footer', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a link to author', () => {
    const link = fixture
      .nativeElement
      .querySelector('.app-footer-link a');
    const href = link.getAttribute('href');
    const text = link.textContent;
    expect(href).toContain('https://www.resource-coordinate.com');
    expect(text).toContain('www.resource-coordinate.com');
  });
});
