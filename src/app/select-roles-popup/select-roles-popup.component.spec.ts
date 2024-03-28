import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRolesPopupComponent } from './select-roles-popup.component';

describe('SelectRolesPopupComponent', () => {
  let component: SelectRolesPopupComponent;
  let fixture: ComponentFixture<SelectRolesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRolesPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRolesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
