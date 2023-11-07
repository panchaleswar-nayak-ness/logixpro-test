import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeTsImportExportJobTypeComponent } from './ie-ts-import-export-job-type.component';

describe('IeTsImportExportJobTypeComponent', () => {
  let component: IeTsImportExportJobTypeComponent;
  let fixture: ComponentFixture<IeTsImportExportJobTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeTsImportExportJobTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeTsImportExportJobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
