import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtItemDetailsComponent } from './gt-item-details.component';

describe('GtItemDetailsComponent', () => {
  let component: GtItemDetailsComponent;
  let fixture: ComponentFixture<GtItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtItemDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GtItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
