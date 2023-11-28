import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPreferencesComponent } from './admin-preferences.component';

describe('AdminPreferencesComponent', () => {
  let component: AdminPreferencesComponent;
  let fixture: ComponentFixture<AdminPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
