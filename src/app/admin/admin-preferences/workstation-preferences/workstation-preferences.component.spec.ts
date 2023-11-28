import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationPreferencesComponent } from './workstation-preferences.component';

describe('WorkstationPreferencesComponent', () => {
  let component: WorkstationPreferencesComponent;
  let fixture: ComponentFixture<WorkstationPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkstationPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkstationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
