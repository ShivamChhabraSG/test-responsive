import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsProcessingScreenComponent } from './claims-processing-screen.component';

describe('ClaimsProcessingScreenComponent', () => {
  let component: ClaimsProcessingScreenComponent;
  let fixture: ComponentFixture<ClaimsProcessingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsProcessingScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsProcessingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
