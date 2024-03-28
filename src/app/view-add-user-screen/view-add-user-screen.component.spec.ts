import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddUserScreenComponent } from './view-add-user-screen.component';

describe('ViewAddUserScreenComponent', () => {
  let component: ViewAddUserScreenComponent;
  let fixture: ComponentFixture<ViewAddUserScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAddUserScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAddUserScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
