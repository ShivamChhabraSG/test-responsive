import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsUploadComponent } from './claims-upload.component';

describe('ClaimsUploadComponent', () => {
  let component: ClaimsUploadComponent;
  let fixture: ComponentFixture<ClaimsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
