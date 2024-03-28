import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNrlmUploadComponent } from './view-nrlm-upload.component';

describe('ViewNrlmUploadComponent', () => {
  let component: ViewNrlmUploadComponent;
  let fixture: ComponentFixture<ViewNrlmUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNrlmUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNrlmUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
