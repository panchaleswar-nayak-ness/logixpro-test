import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpOrderSelectionListComponent } from './bp-order-selection-list.component';

describe('BpOrderSelectionListComponent', () => {
  let component: BpOrderSelectionListComponent;
  let fixture: ComponentFixture<BpOrderSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpOrderSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpOrderSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
