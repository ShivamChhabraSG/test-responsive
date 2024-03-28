import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrlmUploadScreenComponent } from './nrlm-upload-screen.component';

describe('NrlmUploadScreenComponent', () => {
  let component: NrlmUploadScreenComponent;
  let fixture: ComponentFixture<NrlmUploadScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NrlmUploadScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrlmUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
