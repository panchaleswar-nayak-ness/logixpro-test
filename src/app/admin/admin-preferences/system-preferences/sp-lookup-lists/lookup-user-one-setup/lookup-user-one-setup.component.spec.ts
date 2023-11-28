import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupUserOneSetupComponent } from './lookup-user-one-setup.component';

describe('LookupUserOneSetupComponent', () => {
  let component: LookupUserOneSetupComponent;
  let fixture: ComponentFixture<LookupUserOneSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupUserOneSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupUserOneSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
