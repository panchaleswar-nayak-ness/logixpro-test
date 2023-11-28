import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupUserTwoSetupComponent } from './lookup-user-two-setup.component';

describe('LookupUserTwoSetupComponent', () => {
  let component: LookupUserTwoSetupComponent;
  let fixture: ComponentFixture<LookupUserTwoSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupUserTwoSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupUserTwoSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
