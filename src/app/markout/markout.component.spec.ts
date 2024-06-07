import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutComponent } from './markout.component';

describe('MarkoutComponent', () => {
  let component: MarkoutComponent;
  let fixture: ComponentFixture<MarkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
