import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizationHeaderComponent } from './utilization-header.component';

describe('UtilizationHeaderComponent', () => {
  let component: UtilizationHeaderComponent;
  let fixture: ComponentFixture<UtilizationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilizationHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilizationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
