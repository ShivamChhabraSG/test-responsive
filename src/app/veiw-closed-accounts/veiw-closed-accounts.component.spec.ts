import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwClosedAccountsComponent } from './veiw-closed-accounts.component';

describe('VeiwClosedAccountsComponent', () => {
  let component: VeiwClosedAccountsComponent;
  let fixture: ComponentFixture<VeiwClosedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiwClosedAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiwClosedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
