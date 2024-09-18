import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupBlindInductionComponent } from './lookup-blind-induction.component';

describe('LookupBlindInductionComponent', () => {
  let component: LookupBlindInductionComponent;
  let fixture: ComponentFixture<LookupBlindInductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupBlindInductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupBlindInductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
