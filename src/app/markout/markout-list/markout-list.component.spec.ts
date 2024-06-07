import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutListComponent } from './markout-list.component';

describe('MarkoutListComponent', () => {
  let component: MarkoutListComponent;
  let fixture: ComponentFixture<MarkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
