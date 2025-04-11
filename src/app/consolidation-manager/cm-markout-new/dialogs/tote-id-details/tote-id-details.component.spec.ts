import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToteIdDetailsComponent } from './tote-id-details.component';

describe('ToteIdDetailsComponent', () => {
  let component: ToteIdDetailsComponent;
  let fixture: ComponentFixture<ToteIdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToteIdDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToteIdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
