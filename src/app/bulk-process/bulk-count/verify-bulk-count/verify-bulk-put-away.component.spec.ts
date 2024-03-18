import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBulkCountComponent } from './verify-bulk-count.component';

describe('VerifyBulkPutAwayComponent', () => {
  let component: VerifyBulkCountComponent;
  let fixture: ComponentFixture<VerifyBulkCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyBulkCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyBulkCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
