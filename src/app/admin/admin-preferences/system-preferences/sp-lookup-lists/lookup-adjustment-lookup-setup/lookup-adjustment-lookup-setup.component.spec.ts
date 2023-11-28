import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupAdjustmentLookupSetupComponent } from './lookup-adjustment-lookup-setup.component';

describe('LookupAdjustmentLookupSetupComponent', () => {
  let component: LookupAdjustmentLookupSetupComponent;
  let fixture: ComponentFixture<LookupAdjustmentLookupSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupAdjustmentLookupSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupAdjustmentLookupSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
