import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutNewToteAuditComponent } from './markout-new-tote-audit.component';

describe('MarkoutNewToteAuditComponent', () => {
  let component: MarkoutNewToteAuditComponent;
  let fixture: ComponentFixture<MarkoutNewToteAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutNewToteAuditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutNewToteAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
