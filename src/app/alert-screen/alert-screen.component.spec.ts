import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertScreenComponent } from './alert-screen.component';

describe('AlertScreenComponent', () => {
  let component: AlertScreenComponent;
  let fixture: ComponentFixture<AlertScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
