import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedItemComponent } from './verified-item.component';

describe('VerifiedItemComponent', () => {
  let component: VerifiedItemComponent;
  let fixture: ComponentFixture<VerifiedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
