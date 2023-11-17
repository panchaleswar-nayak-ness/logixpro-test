import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportsAndLabelsComponent } from './custom-reports-and-labels.component';

describe('CustomReportsAndLabelsComponent', () => {
  let component: CustomReportsAndLabelsComponent;
  let fixture: ComponentFixture<CustomReportsAndLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomReportsAndLabelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomReportsAndLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
