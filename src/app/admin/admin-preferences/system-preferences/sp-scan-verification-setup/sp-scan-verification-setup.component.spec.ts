import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpScanVerificationSetupComponent } from './sp-scan-verification-setup.component';

describe('SpScanVerificationSetupComponent', () => {
  let component: SpScanVerificationSetupComponent;
  let fixture: ComponentFixture<SpScanVerificationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpScanVerificationSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpScanVerificationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
