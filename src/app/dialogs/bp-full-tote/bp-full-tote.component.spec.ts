import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpFullToteComponent } from './bp-full-tote.component';

describe('BpFullToteComponent', () => {
  let component: BpFullToteComponent;
  let fixture: ComponentFixture<BpFullToteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpFullToteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpFullToteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
