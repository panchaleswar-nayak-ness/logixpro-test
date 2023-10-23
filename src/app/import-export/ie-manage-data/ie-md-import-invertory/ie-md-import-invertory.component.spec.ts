import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeMdImportInvertoryComponent } from './ie-md-import-invertory.component';

describe('IeMdImportInvertoryComponent', () => {
  let component: IeMdImportInvertoryComponent;
  let fixture: ComponentFixture<IeMdImportInvertoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeMdImportInvertoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeMdImportInvertoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
