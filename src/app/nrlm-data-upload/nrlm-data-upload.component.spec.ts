import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrlmDataUploadComponent } from './nrlm-data-upload.component';

describe('NrlmDataUploadComponent', () => {
  let component: NrlmDataUploadComponent;
  let fixture: ComponentFixture<NrlmDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NrlmDataUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrlmDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
