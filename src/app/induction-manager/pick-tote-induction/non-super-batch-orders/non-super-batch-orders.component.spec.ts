import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonSuperBatchOrdersComponent } from './non-super-batch-orders.component';

describe('NonSuperBatchOrdersComponent', () => {
  let component: NonSuperBatchOrdersComponent;
  let fixture: ComponentFixture<NonSuperBatchOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonSuperBatchOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonSuperBatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
