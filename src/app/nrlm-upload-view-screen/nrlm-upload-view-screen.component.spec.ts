import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrlmUploadViewScreenComponent } from './nrlm-upload-view-screen.component';

describe('NrlmUploadViewScreenComponent', () => {
  let component: NrlmUploadViewScreenComponent;
  let fixture: ComponentFixture<NrlmUploadViewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NrlmUploadViewScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrlmUploadViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
