import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpWorkstationSetupComponent } from './wp-workstation-setup.component';

describe('WpWorkstationSetupComponent', () => {
  let component: WpWorkstationSetupComponent;
  let fixture: ComponentFixture<WpWorkstationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpWorkstationSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpWorkstationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
