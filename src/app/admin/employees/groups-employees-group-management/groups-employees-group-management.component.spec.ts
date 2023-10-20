import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsEmployeesGroupManagementComponent } from './groups-employees-group-management.component';

describe('GroupsEmployeesGroupManagementComponent', () => {
  let component: GroupsEmployeesGroupManagementComponent;
  let fixture: ComponentFixture<GroupsEmployeesGroupManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsEmployeesGroupManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsEmployeesGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
