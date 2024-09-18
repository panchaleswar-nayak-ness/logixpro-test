import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupHotPutAwayComponent } from './lookup-hot-put-away.component';

describe('LookupHotPutAwayComponent', () => {
  let component: LookupHotPutAwayComponent;
  let fixture: ComponentFixture<LookupHotPutAwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupHotPutAwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupHotPutAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
