import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTransactionComponent } from './bulk-transaction.component';

describe('BulkTransactionComponent', () => {
  let component: BulkTransactionComponent;
  let fixture: ComponentFixture<BulkTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
