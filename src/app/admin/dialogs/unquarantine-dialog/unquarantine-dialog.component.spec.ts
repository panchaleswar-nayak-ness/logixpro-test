import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnquarantineDialogComponent } from './unquarantine-dialog.component';

describe('UnquarantineDialogComponent', () => {
  let component: UnquarantineDialogComponent;
  let fixture: ComponentFixture<UnquarantineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnquarantineDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnquarantineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
