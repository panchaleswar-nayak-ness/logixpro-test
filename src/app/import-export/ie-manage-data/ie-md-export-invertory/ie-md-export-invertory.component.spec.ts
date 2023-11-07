import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeMdExportInvertoryComponent } from './ie-md-export-invertory.component';

describe('IeMdExportInvertoryComponent', () => {
  let component: IeMdExportInvertoryComponent;
  let fixture: ComponentFixture<IeMdExportInvertoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeMdExportInvertoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeMdExportInvertoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
