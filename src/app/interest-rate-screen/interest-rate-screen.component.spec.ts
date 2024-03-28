import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestRateScreenComponent } from './interest-rate-screen.component';

describe('InterestRateScreenComponent', () => {
  let component: InterestRateScreenComponent;
  let fixture: ComponentFixture<InterestRateScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestRateScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestRateScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
