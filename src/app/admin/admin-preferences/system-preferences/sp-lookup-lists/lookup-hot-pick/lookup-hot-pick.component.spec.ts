import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupHotPickComponent } from './lookup-hot-pick.component';

describe('LookupHotPickComponent', () => {
  let component: LookupHotPickComponent;
  let fixture: ComponentFixture<LookupHotPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupHotPickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupHotPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
