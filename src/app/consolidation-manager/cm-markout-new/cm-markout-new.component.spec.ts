import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMarkoutNewComponent } from './cm-markout-new.component';

describe('CmMarkoutNewComponent', () => {
  let component: CmMarkoutNewComponent;
  let fixture: ComponentFixture<CmMarkoutNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmMarkoutNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmMarkoutNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
