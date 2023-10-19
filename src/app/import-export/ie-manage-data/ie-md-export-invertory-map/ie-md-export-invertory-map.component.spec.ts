import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeMdExportInvertoryMapComponent } from './ie-md-export-invertory-map.component';

describe('IeMdExportInvertoryMapComponent', () => {
  let component: IeMdExportInvertoryMapComponent;
  let fixture: ComponentFixture<IeMdExportInvertoryMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeMdExportInvertoryMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeMdExportInvertoryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
