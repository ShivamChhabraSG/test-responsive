import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsSettlementComponent } from './claims-settlement.component';

describe('ClaimsSettlementComponent', () => {
  let component: ClaimsSettlementComponent;
  let fixture: ComponentFixture<ClaimsSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
