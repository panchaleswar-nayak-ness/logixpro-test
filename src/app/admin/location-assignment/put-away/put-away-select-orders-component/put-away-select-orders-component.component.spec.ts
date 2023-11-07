import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutAwaySelectOrdersComponentComponent } from './put-away-select-orders-component.component';

describe('PutAwaySelectOrdersComponentComponent', () => {
  let component: PutAwaySelectOrdersComponentComponent;
  let fixture: ComponentFixture<PutAwaySelectOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutAwaySelectOrdersComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutAwaySelectOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
