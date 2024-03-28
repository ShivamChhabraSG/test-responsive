import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningAuthDialogComponent } from './warning-auth-dialog.component';

describe('WarningAuthDialogComponent', () => {
  let component: WarningAuthDialogComponent;
  let fixture: ComponentFixture<WarningAuthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningAuthDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningAuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
