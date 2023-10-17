import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeadingComponentComponent } from './icon-heading-component.component';

describe('IconHeadingComponentComponent', () => {
  let component: IconHeadingComponentComponent;
  let fixture: ComponentFixture<IconHeadingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconHeadingComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHeadingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
