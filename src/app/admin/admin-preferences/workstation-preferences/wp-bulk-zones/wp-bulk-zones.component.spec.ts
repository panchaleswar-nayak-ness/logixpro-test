import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpBulkZonesComponent } from './wp-bulk-zones.component';

describe('WpBulkZonesComponent', () => {
  let component: WpBulkZonesComponent;
  let fixture: ComponentFixture<WpBulkZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpBulkZonesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpBulkZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
