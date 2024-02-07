import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBulkPutAwayComponent } from './verify-bulk-put-away.component';

describe('VerifyBulkPutAwayComponent', () => {
  let component: VerifyBulkPutAwayComponent;
  let fixture: ComponentFixture<VerifyBulkPutAwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyBulkPutAwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyBulkPutAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
