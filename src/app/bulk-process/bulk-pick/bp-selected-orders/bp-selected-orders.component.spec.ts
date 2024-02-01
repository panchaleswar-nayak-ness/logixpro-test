import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpSelectedOrdersComponent } from './bp-selected-orders.component';

describe('BpSelectedOrdersComponent', () => {
  let component: BpSelectedOrdersComponent;
  let fixture: ComponentFixture<BpSelectedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpSelectedOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpSelectedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
