import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesViewScreenComponent } from './roles-view-screen.component';

describe('RolesViewScreenComponent', () => {
  let component: RolesViewScreenComponent;
  let fixture: ComponentFixture<RolesViewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesViewScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
