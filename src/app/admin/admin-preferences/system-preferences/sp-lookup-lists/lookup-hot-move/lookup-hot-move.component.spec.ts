import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupHotMoveComponent } from './lookup-hot-move.component';

describe('LookupHotMoveComponent', () => {
  let component: LookupHotMoveComponent;
  let fixture: ComponentFixture<LookupHotMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupHotMoveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupHotMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
