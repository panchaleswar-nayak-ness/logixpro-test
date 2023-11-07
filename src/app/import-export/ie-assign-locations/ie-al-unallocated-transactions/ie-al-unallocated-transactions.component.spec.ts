import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeAlUnallocatedTransactionsComponent } from './ie-al-unallocated-transactions.component';

describe('IeAlUnallocatedTransactionsComponent', () => {
  let component: IeAlUnallocatedTransactionsComponent;
  let fixture: ComponentFixture<IeAlUnallocatedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeAlUnallocatedTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeAlUnallocatedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
