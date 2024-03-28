import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserDataComponent } from './add-user-data.component';

describe('AddUserDataComponent', () => {
  let component: AddUserDataComponent;
  let fixture: ComponentFixture<AddUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
