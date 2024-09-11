import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickToteInductionComponent } from './pick-tote-induction.component';

describe('PickToteInductionComponent', () => {
  let component: PickToteInductionComponent;
  let fixture: ComponentFixture<PickToteInductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickToteInductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickToteInductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
