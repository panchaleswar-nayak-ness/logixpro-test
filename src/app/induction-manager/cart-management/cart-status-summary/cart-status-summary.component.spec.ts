import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStatusSummaryComponent } from './cart-status-summary.component';

describe('CartStatusSummaryComponent', () => {
  let component: CartStatusSummaryComponent;
  let fixture: ComponentFixture<CartStatusSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartStatusSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
