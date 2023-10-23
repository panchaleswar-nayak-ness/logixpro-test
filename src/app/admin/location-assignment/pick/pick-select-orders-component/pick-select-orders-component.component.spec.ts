import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickSelectOrdersComponentComponent } from './pick-select-orders-component.component';

describe('PickSelectOrdersComponentComponent', () => {
  let component: PickSelectOrdersComponentComponent;
  let fixture: ComponentFixture<PickSelectOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickSelectOrdersComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickSelectOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
