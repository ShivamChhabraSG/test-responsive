import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsDataComponent } from './claims-data.component';

describe('ClaimsDataComponent', () => {
  let component: ClaimsDataComponent;
  let fixture: ComponentFixture<ClaimsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
