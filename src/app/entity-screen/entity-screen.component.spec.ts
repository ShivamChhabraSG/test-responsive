import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { EntityScreenComponent } from './entity-screen.component';
import { MasterDataScreenComponent } from '../master-data-screen/master-data-screen.component';

describe('MasterDataScreenComponent', () => {
  let component: MasterDataScreenComponent;
  let fixture: ComponentFixture<MasterDataScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
