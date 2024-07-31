import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizationPiechartComponent } from './utilization-piechart.component';

describe('UtilizationPiechartComponent', () => {
  let component: UtilizationPiechartComponent;
  let fixture: ComponentFixture<UtilizationPiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilizationPiechartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilizationPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
