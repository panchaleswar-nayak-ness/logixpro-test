import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCountComponent } from './bulk-count.component';

describe('CountComponent', () => {
  let component: BulkCountComponent;
  let fixture: ComponentFixture<BulkCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
