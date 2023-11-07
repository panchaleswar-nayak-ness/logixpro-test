import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountSelectOrdersComponentComponent } from './count-select-orders-component.component';

describe('CountSelectOrdersComponentComponent', () => {
  let component: CountSelectOrdersComponentComponent;
  let fixture: ComponentFixture<CountSelectOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountSelectOrdersComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountSelectOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
