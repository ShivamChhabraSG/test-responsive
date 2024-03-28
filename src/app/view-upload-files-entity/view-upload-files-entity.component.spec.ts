import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadFilesEntityComponent } from './view-upload-files-entity.component';

describe('ViewUploadFilesEntityComponent', () => {
  let component: ViewUploadFilesEntityComponent;
  let fixture: ComponentFixture<ViewUploadFilesEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUploadFilesEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUploadFilesEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
