import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMarkoutComponent } from './cm-markout.component';

describe('CmMarkoutComponent', () => {
  let component: CmMarkoutComponent;
  let fixture: ComponentFixture<CmMarkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmMarkoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmMarkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
