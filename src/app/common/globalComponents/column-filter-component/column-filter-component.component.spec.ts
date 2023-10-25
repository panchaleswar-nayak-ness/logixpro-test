import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFilterComponentComponent } from './column-filter-component.component';

describe('ColumnFilterComponentComponent', () => {
  let component: ColumnFilterComponentComponent;
  let fixture: ComponentFixture<ColumnFilterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnFilterComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
