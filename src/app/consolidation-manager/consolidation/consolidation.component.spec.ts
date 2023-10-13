import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidationComponent } from './consolidation.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsolidationManagerService } from '../consolidation-manager.service';
import { PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';

fdescribe('ConsolidationComponent', () => {
  let component: ConsolidationComponent;
  let fixture: ComponentFixture<ConsolidationComponent>;
  let global:GlobalService;
  let matSelectChangeMock: MatSelectChange;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidationComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatSortModule
        
       
      ],
      providers: [
        ConsolidationManagerService,
        PageEvent,
        LiveAnnouncer,
        ToastrService,
        MatDialog,
        
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct index and value count', () => {
    // Set up test data
    component.filterValue = 'test';
    component.tableData_1 = {
      data: [
        { col1: 'test', col2: 'value2' },
        { col1: 'value1', col2: 'test' },
        { col1: 'value1', col2: 'value2' },
      ],
    };
    
    // Call the function with test data
    const result = component.checkVerifyType(1,'test');

    // Expect the result to be correct
    expect(result.index).toBe(1);
    expect(result.valueCount).toBe(2);
  });

  it('should handle undefined values', () => {
    // Set up test data with undefined value
    component.filterValue = 'test';
    component.tableData_1 = {
      data: [
        { col1: 'test', col2: 'value2' },
        { col1: undefined, col2: 'value2' },
      ],
    };
    
    // Call the function with undefined value
    const result = component.checkVerifyType(0, undefined);

    // Expect the result to be correct
    expect(result.index).toBe(0);
    expect(result.valueCount).toBe(1);
  });

  it('should handle empty table data', () => {
    // Set up test data with empty table data
    component.filterValue = 'test';
    component.tableData_1 = {
      data: [],
    };
    
    // Call the function with empty table data
    const result = component.checkVerifyType(1,'test');

    // Expect the result to be correct
    expect(result.index).toBeUndefined();
    expect(result.valueCount).toBe(0);
  });

  beforeEach(() => {
    matSelectChangeMock = {
      value: 1
    } as MatSelectChange;
    
    // Initialize component properties if needed
    // For example:
    component.filterOption = [
      { key: 1, value: 'Option 1' },
      { key: 2, value: 'Option 2' },
      { key: 3, value: 'Option 3' }
    ];
    component.displayedColumns_1 = ['itemNumber', 'supplierItemID'];
    component.isitemVisible = true;
    component.issupplyVisible = false;
    component.startSelectFilter = 0;
    component.startSelectFilterLabel = '';
  });

  it('should set startSelectFilter and startSelectFilterLabel correctly', () => {
    // Set up test data
    matSelectChangeMock.value = 1;

    // Call the function with test data
    component.getSelected(matSelectChangeMock);

    // Expect startSelectFilter and startSelectFilterLabel to be set correctly
    expect(component.startSelectFilter).toBe(1);
    expect(component.startSelectFilterLabel).toBe('Option 1');
  });

  it('should set isitemVisible and displayedColumns_1 correctly for value 1', () => {
    // Set up test data
    matSelectChangeMock.value = 1;

    // Call the function with test data
    component.getSelected(matSelectChangeMock);

    // Expect isitemVisible and displayedColumns_1 to be set correctly
    expect(component.isitemVisible).toBe(true);
    expect(component.issupplyVisible).toBe(false);
    expect(component.displayedColumns_1[0]).toBe('itemNumber');
  });

  it('should set issupplyVisible and displayedColumns_1 correctly for value 2', () => {
    // Set up test data
    matSelectChangeMock.value = 2;

    // Call the function with test data
    component.getSelected(matSelectChangeMock);

    // Expect issupplyVisible and displayedColumns_1 to be set correctly
    expect(component.isitemVisible).toBe(false);
    expect(component.issupplyVisible).toBe(true);
    expect(component.displayedColumns_1[0]).toBe('supplierItemID');
  });

  
  
});
