import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBulkComponent } from './verify-bulk.component';

describe('VerifyBulkComponent', () => {
  let component: VerifyBulkComponent;
  let fixture: ComponentFixture<VerifyBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
