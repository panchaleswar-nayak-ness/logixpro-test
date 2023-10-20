import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCircleComponent } from './stats-circle.component';

describe('StatsCircleComponent', () => {
  let component: StatsCircleComponent;
  let fixture: ComponentFixture<StatsCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsCircleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
