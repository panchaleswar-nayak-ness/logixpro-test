import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpStatusComponent } from './bp-status.component';

describe('BpStatusComponent', () => {
  let component: BpStatusComponent;
  let fixture: ComponentFixture<BpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
