import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationLoginComponent } from './workstation-login.component';

describe('WorkstationLoginComponent', () => {
  let component: WorkstationLoginComponent;
  let fixture: ComponentFixture<WorkstationLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkstationLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkstationLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
