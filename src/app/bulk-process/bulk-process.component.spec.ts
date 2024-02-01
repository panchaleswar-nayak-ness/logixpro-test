import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkProcessComponent } from './bulk-process.component';

describe('BulkProcessComponent', () => {
  let component: BulkProcessComponent;
  let fixture: ComponentFixture<BulkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
