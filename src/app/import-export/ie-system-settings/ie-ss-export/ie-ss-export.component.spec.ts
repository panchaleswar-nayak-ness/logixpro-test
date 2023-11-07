import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeSsExportComponent } from './ie-ss-export.component';

describe('IeSsExportComponent', () => {
  let component: IeSsExportComponent;
  let fixture: ComponentFixture<IeSsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeSsExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeSsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
