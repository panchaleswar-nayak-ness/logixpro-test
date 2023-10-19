import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeSsImportComponent } from './ie-ss-import.component';

describe('IeSsImportComponent', () => {
  let component: IeSsImportComponent;
  let fixture: ComponentFixture<IeSsImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeSsImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeSsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
