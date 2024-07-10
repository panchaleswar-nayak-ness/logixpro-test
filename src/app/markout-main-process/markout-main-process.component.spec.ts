import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutMainProcessComponent } from './markout-main-process.component';

describe('MarkoutMainProcessComponent', () => {
  let component: MarkoutMainProcessComponent;
  let fixture: ComponentFixture<MarkoutMainProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutMainProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutMainProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
