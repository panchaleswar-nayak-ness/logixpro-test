import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpVerifyBulkPickComponent } from './bp-verify-bulk-pick.component';

describe('BpVerifyBulkPickComponent', () => {
  let component: BpVerifyBulkPickComponent;
  let fixture: ComponentFixture<BpVerifyBulkPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpVerifyBulkPickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpVerifyBulkPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
