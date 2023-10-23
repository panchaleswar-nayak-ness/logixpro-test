import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeTsTransactionTypeToExportComponent } from './ie-ts-transaction-type-to-export.component';

describe('IeTsTransactionTypeToExportComponent', () => {
  let component: IeTsTransactionTypeToExportComponent;
  let fixture: ComponentFixture<IeTsTransactionTypeToExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeTsTransactionTypeToExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeTsTransactionTypeToExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
