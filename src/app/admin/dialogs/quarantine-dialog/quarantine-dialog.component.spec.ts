import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarantineDialogComponent } from './quarantine-dialog.component';

describe('QuarantineDialogComponent', () => {
  let component: QuarantineDialogComponent;
  let fixture: ComponentFixture<QuarantineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuarantineDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuarantineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
