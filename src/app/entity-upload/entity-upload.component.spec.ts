import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUploadComponent } from './entity-upload.component';

describe('EntityUploadComponent', () => {
  let component: EntityUploadComponent;
  let fixture: ComponentFixture<EntityUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
