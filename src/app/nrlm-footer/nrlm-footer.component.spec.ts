import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NRLMFooterComponent } from './nrlm-footer.component';

describe('NRLMFooterComponent', () => {
  let component: NRLMFooterComponent;
  let fixture: ComponentFixture<NRLMFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NRLMFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NRLMFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
