import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteManagementDetailViewComponent } from './route-management-detail-view.component';

describe('RouteManagementDetailViewComponent', () => {
  let component: RouteManagementDetailViewComponent;
  let fixture: ComponentFixture<RouteManagementDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteManagementDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteManagementDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
