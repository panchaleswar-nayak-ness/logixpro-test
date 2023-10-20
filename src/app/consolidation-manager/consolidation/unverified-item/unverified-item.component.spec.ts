import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedItemComponent } from './unverified-item.component';

describe('UnverifiedItemComponent', () => {
  let component: UnverifiedItemComponent;
  let fixture: ComponentFixture<UnverifiedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnverifiedItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnverifiedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
