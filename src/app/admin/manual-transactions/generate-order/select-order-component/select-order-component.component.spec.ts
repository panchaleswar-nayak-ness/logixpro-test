import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrderComponentComponent } from './select-order-component.component';

describe('SelectOrderComponentComponent', () => {
  let component: SelectOrderComponentComponent;
  let fixture: ComponentFixture<SelectOrderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOrderComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOrderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
