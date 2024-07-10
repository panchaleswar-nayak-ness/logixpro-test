import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutMainPreferencesComponent } from './markout-main-preferences.component';

describe('MarkoutMainPreferencesComponent', () => {
  let component: MarkoutMainPreferencesComponent;
  let fixture: ComponentFixture<MarkoutMainPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutMainPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutMainPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
