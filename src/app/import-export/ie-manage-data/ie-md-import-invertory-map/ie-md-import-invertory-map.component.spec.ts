import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeMdImportInvertoryMapComponent } from './ie-md-import-invertory-map.component';

describe('IeMdImportInvertoryMapComponent', () => {
  let component: IeMdImportInvertoryMapComponent;
  let fixture: ComponentFixture<IeMdImportInvertoryMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeMdImportInvertoryMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeMdImportInvertoryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
