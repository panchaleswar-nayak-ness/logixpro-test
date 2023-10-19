import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeAlAutoLocationAssignmentComponent } from './ie-al-auto-location-assignment.component';

describe('IeAlAutoLocationAssignmentComponent', () => {
  let component: IeAlAutoLocationAssignmentComponent;
  let fixture: ComponentFixture<IeAlAutoLocationAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeAlAutoLocationAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeAlAutoLocationAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
