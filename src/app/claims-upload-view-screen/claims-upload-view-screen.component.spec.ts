import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsUploadViewScreenComponent } from './claims-upload-view-screen.component';

describe('ClaimsUploadViewScreenComponent', () => {
  let component: ClaimsUploadViewScreenComponent;
  let fixture: ComponentFixture<ClaimsUploadViewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsUploadViewScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsUploadViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
