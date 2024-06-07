import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutStatusComponent } from './markout-status.component';

describe('MarkoutStatusComponent', () => {
  let component: MarkoutStatusComponent;
  let fixture: ComponentFixture<MarkoutStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
