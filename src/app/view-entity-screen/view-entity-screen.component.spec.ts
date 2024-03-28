import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntityScreenComponent } from './view-entity-screen.component';

describe('ViewEntityScreenComponent', () => {
  let component: ViewEntityScreenComponent;
  let fixture: ComponentFixture<ViewEntityScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEntityScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEntityScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
