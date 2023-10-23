import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountOrderSelectionComponentComponent } from './count-order-selection-component.component';

describe('CountOrderSelectionComponentComponent', () => {
  let component: CountOrderSelectionComponentComponent;
  let fixture: ComponentFixture<CountOrderSelectionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountOrderSelectionComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountOrderSelectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
