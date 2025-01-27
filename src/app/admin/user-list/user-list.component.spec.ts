


// 



import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('UserListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule,
      ],
      declarations: [

      ],
      providers: [

      ]
    }).compileComponents();
  });

  it('Placeholder - UserListComponent', () => {
    //expect(true).toBe(true);
  });
});
