import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOrderNumberComponent } from './filter-order-number.component';

describe('FilterOrderNumberComponent', () => {
  let component: FilterOrderNumberComponent;
  let fixture: ComponentFixture<FilterOrderNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterOrderNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterOrderNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
