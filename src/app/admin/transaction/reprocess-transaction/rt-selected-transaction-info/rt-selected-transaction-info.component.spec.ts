import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSelectedTransactionInfoComponent } from './rt-selected-transaction-info.component';

describe('RtSelectedTransactionInfoComponent', () => {
  let component: RtSelectedTransactionInfoComponent;
  let fixture: ComponentFixture<RtSelectedTransactionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtSelectedTransactionInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSelectedTransactionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
