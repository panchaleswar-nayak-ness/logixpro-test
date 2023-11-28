import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpPickLevelsComponent } from './wp-pick-levels.component';

describe('WpPickLevelsComponent', () => {
  let component: WpPickLevelsComponent;
  let fixture: ComponentFixture<WpPickLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpPickLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpPickLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
