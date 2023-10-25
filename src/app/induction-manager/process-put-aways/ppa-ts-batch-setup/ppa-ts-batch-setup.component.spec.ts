import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpaTsBatchSetupComponent } from './ppa-ts-batch-setup.component';

describe('PpaTsBatchSetupComponent', () => {
  let component: PpaTsBatchSetupComponent;
  let fixture: ComponentFixture<PpaTsBatchSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpaTsBatchSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpaTsBatchSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
