import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAssignedFunctionsCompComponent } from './groups-assigned-functions-comp.component';

describe('GroupsAssignedFunctionsCompComponent', () => {
  let component: GroupsAssignedFunctionsCompComponent;
  let fixture: ComponentFixture<GroupsAssignedFunctionsCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsAssignedFunctionsCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsAssignedFunctionsCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
