import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperBatchOrdersComponent } from './super-batch-orders.component';

describe('SuperBatchOrdersComponent', () => {
  let component: SuperBatchOrdersComponent;
  let fixture: ComponentFixture<SuperBatchOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperBatchOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperBatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
