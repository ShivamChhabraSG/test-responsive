import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedAccountDataComponent } from './closed-account-data.component';

describe('ClosedAccountDataComponent', () => {
  let component: ClosedAccountDataComponent;
  let fixture: ComponentFixture<ClosedAccountDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedAccountDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedAccountDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
