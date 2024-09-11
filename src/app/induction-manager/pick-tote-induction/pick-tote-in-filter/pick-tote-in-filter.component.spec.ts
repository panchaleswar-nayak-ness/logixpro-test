import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickToteInFilterComponent } from './pick-tote-in-filter.component';

describe('PickToteInFilterComponent', () => {
  let component: PickToteInFilterComponent;
  let fixture: ComponentFixture<PickToteInFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickToteInFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickToteInFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
