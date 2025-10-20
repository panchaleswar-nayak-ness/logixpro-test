import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyPickComponent } from './emergency-pick.component';

describe('EmergencyPickComponent', () => {
  let component: EmergencyPickComponent;
  let fixture: ComponentFixture<EmergencyPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyPickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
