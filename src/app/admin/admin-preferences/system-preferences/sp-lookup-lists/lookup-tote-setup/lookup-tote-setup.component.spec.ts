import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupToteSetupComponent } from './lookup-tote-setup.component';

describe('LookupToteSetupComponent', () => {
  let component: LookupToteSetupComponent;
  let fixture: ComponentFixture<LookupToteSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupToteSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupToteSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
