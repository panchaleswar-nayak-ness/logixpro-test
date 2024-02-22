import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpWsWorkstationSettingsComponent } from './wp-ws-workstation-settings.component';

describe('WpWsWorkstationSettingsComponent', () => {
  let component: WpWsWorkstationSettingsComponent;
  let fixture: ComponentFixture<WpWsWorkstationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpWsWorkstationSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpWsWorkstationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
