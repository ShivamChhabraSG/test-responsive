import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningLogDialogComponent } from './warning-log-dialog.component';

describe('WarningLogDialogComponent', () => {
  let component: WarningLogDialogComponent;
  let fixture: ComponentFixture<WarningLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningLogDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
