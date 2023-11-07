import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SLSearchOrderNumberToteComponent } from './sl-search-order-number-tote.component';

describe('SLSearchOrderNumberToteComponent', () => {
  let component: SLSearchOrderNumberToteComponent;
  let fixture: ComponentFixture<SLSearchOrderNumberToteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SLSearchOrderNumberToteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SLSearchOrderNumberToteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
