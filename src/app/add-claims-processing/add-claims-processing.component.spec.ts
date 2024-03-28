import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimsProcessingComponent } from './add-claims-processing.component';

describe('AddClaimsProcessingComponent', () => {
  let component: AddClaimsProcessingComponent;
  let fixture: ComponentFixture<AddClaimsProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClaimsProcessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClaimsProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
