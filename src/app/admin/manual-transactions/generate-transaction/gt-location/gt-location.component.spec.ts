import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtLocationComponent } from './gt-location.component';

describe('GtLocationComponent', () => {
  let component: GtLocationComponent;
  let fixture: ComponentFixture<GtLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GtLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
