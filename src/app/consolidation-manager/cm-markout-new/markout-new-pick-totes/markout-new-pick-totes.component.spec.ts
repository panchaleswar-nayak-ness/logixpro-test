import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutNewPickTotesComponent } from './markout-new-pick-totes.component';

describe('MarkoutNewPickTotesComponent', () => {
  let component: MarkoutNewPickTotesComponent;
  let fixture: ComponentFixture<MarkoutNewPickTotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutNewPickTotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutNewPickTotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
