import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesMarkoutComponent } from './preferences-markout.component';

describe('PreferencesMarkoutComponent', () => {
  let component: PreferencesMarkoutComponent;
  let fixture: ComponentFixture<PreferencesMarkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesMarkoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesMarkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
