import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveLocationsComponent } from './move-locations.component';

describe('MoveLocationsComponent', () => {
  let component: MoveLocationsComponent;
  let fixture: ComponentFixture<MoveLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveLocationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
