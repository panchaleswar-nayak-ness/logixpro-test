import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpPodSetupComponent } from './wp-pod-setup.component';

describe('WpPodSetupComponent', () => {
  let component: WpPodSetupComponent;
  let fixture: ComponentFixture<WpPodSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpPodSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpPodSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
