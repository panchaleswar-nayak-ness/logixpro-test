import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprefInductionFilterComponent } from './impref-induction-filter.component';

describe('ImprefInductionFilterComponent', () => {
  let component: ImprefInductionFilterComponent;
  let fixture: ComponentFixture<ImprefInductionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprefInductionFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprefInductionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
