import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPutAwayComponent } from './bulk-put-away.component';

describe('BulkPutAwayComponent', () => {
  let component: BulkPutAwayComponent;
  let fixture: ComponentFixture<BulkPutAwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPutAwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPutAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
