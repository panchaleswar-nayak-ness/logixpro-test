import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpMiscellaneousSettingsComponent } from './wp-miscellaneous-settings.component';

describe('WpMiscellaneousSettingsComponent', () => {
  let component: WpMiscellaneousSettingsComponent;
  let fixture: ComponentFixture<WpMiscellaneousSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpMiscellaneousSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpMiscellaneousSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
