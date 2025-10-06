import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSearchComponent } from './cart-search.component';

describe('CartSearchComponent', () => {
  let component: CartSearchComponent;
  let fixture: ComponentFixture<CartSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
