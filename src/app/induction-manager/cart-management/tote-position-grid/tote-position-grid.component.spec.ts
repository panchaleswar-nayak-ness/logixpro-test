import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotePositionGridComponent } from './tote-position-grid.component';

describe('TotePositionGridComponent', () => {
  let component: TotePositionGridComponent;
  let fixture: ComponentFixture<TotePositionGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotePositionGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotePositionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
