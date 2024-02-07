import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSelectionListComponent } from './order-selection-list.component';

describe('OrderSelectionListComponent', () => {
  let component: OrderSelectionListComponent;
  let fixture: ComponentFixture<OrderSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
