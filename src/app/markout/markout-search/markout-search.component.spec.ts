import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutSearchComponent } from './markout-search.component';

describe('MarkoutSearchComponent', () => {
  let component: MarkoutSearchComponent;
  let fixture: ComponentFixture<MarkoutSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
