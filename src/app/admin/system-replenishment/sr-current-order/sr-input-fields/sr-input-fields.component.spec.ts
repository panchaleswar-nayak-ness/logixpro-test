import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrInputFieldsComponent } from './sr-input-fields.component';

describe('SrInputFieldsComponent', () => {
  let component: SrInputFieldsComponent;
  let fixture: ComponentFixture<SrInputFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrInputFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrInputFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
