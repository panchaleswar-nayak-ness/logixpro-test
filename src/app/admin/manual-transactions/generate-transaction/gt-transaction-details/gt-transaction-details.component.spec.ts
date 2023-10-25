import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtTransactionDetailsComponent } from './gt-transaction-details.component';

describe('GtTransactionDetailsComponent', () => {
  let component: GtTransactionDetailsComponent;
  let fixture: ComponentFixture<GtTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GtTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
