import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrNewInputFieldsComponent } from './sr-new-input-fields.component';

describe('SrNewInputFieldsComponent', () => {
  let component: SrNewInputFieldsComponent;
  let fixture: ComponentFixture<SrNewInputFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrNewInputFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrNewInputFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
