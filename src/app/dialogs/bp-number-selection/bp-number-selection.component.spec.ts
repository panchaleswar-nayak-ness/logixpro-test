import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpNumberSelectionComponent } from './bp-number-selection.component';

describe('BpNumberSelectionComponent', () => {
  let component: BpNumberSelectionComponent;
  let fixture: ComponentFixture<BpNumberSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpNumberSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpNumberSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
