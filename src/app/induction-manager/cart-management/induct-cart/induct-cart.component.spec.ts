import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InductCartComponent } from './induct-cart.component';

describe('InductCartComponent', () => {
  let component: InductCartComponent;
  let fixture: ComponentFixture<InductCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InductCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InductCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
