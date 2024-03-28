import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutScreenComponent } from './logout-screen.component';

describe('LogoutScreenComponent', () => {
  let component: LogoutScreenComponent;
  let fixture: ComponentFixture<LogoutScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
