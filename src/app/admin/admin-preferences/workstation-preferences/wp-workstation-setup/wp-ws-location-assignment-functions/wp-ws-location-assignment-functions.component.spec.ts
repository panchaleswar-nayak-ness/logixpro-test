import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpWsLocationAssignmentFunctionsComponent } from './wp-ws-location-assignment-functions.component';

describe('WpWsLocationAssignmentFunctionsComponent', () => {
  let component: WpWsLocationAssignmentFunctionsComponent;
  let fixture: ComponentFixture<WpWsLocationAssignmentFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpWsLocationAssignmentFunctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpWsLocationAssignmentFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
