import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodSetupComponentComponent } from './pod-setup-component.component';

describe('PodSetupComponentComponent', () => {
  let component: PodSetupComponentComponent;
  let fixture: ComponentFixture<PodSetupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodSetupComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodSetupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
