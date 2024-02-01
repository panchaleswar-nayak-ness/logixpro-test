import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPickComponent } from './bulk-pick.component';

describe('BulkPickComponent', () => {
  let component: BulkPickComponent;
  let fixture: ComponentFixture<BulkPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
