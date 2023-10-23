import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeSsTransactionsComponent } from './ie-ss-transactions.component';

describe('IeSsTransactionsComponent', () => {
  let component: IeSsTransactionsComponent;
  let fixture: ComponentFixture<IeSsTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeSsTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeSsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
