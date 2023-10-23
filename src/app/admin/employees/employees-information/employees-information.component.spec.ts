import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesInformationComponent } from './employees-information.component';

describe('EmployeesInformationComponent', () => {
  let component: EmployeesInformationComponent;
  let fixture: ComponentFixture<EmployeesInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
