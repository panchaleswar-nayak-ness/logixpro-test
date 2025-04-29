import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutNewPickLinesComponent } from './markout-new-pick-lines.component';

describe('MarkoutNewPickLinesComponent', () => {
  let component: MarkoutNewPickLinesComponent;
  let fixture: ComponentFixture<MarkoutNewPickLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutNewPickLinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutNewPickLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
