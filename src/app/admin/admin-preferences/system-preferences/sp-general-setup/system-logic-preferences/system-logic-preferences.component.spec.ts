import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogicPreferencesComponent } from './system-logic-preferences.component';

describe('SystemLogicPreferencesComponent', () => {
  let component: SystemLogicPreferencesComponent;
  let fixture: ComponentFixture<SystemLogicPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemLogicPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLogicPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
