import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountsUploadComponent } from './view-accounts-upload.component';

describe('ViewAccountsUploadComponent', () => {
  let component: ViewAccountsUploadComponent;
  let fixture: ComponentFixture<ViewAccountsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccountsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
