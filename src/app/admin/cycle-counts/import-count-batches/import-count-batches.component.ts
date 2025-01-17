import { Component, OnInit, Inject, EventEmitter, Output, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import {  FilterItemNumbersComponentCycleCount } from '../filter-item-numbers_cycle_count/filter-item-numbers_cycle_count.component';
import * as XLSX from 'xlsx';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/common/constants/menu.constants';
import { MatSelect } from '@angular/material/select';
import { LocalStorageService } from 'src/app/common/services/LocalStorage.service';

export interface PeriodicElement {
  invMapID:number;
  itemNumber: string;
  description: string;
  locationQuantity: number;
  um: string;
  warehouse: string;
  locations: string;
  velocityCode: string;
  cellSize: string;
  serialNumber: string;
  lotNumber: string;
  expirationDate: string;
}

export interface Pagination {
  total: string;
  recordsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface SortColumn {
  columnIndex: number;
  sortOrder: 'asc' | 'desc'; 
}
export interface DialogData {
  selectedImportType: string;
  filterOptions?: string[];
  isEditable?: boolean;
}

@Component({
  selector: 'app-import-count-batches',
  templateUrl: './import-count-batches.component.html',
  styleUrls: ['./import-count-batches.component.scss'],
})
export class ImportCountBatchesComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  UnitOfMeasure: string = this.fieldMappings.unitOfMeasure;
  dataSource = new MatTableDataSource<PeriodicElement>();
  placeholders = Placeholders;
  IncludeEmptyCheckedValue :any;
  IncludeOtherCheckedValue :any;
  displayedColumns: string[] = [
    'itemNumber',
    'description',
    'locationQuantity',
    'um',
    'warehouse',
    'locations',
    'velocityCode',
    'cellSize',
    'serialNumber',
    'lotNumber',
    'expirationDate',
  ];
  selectedTabIndex: number = 0;
  @Output() countsUpdated = new EventEmitter<string>();
  @Output() eventChange = new EventEmitter<Event>(); 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelect) matSelect: MatSelect;
  
  dataSourcee: PeriodicElement[] = [];
  filtersForm: FormGroup;
  isDataAvailable: boolean = false;
  pageEvent: PageEvent;


  importTypes: string[] = ['Location', this.ItemNumber];
  filterOptions: string[] = []; 


 // Add a getter for formatted importTypes
 get formattedImportTypes(): string[] {
  return this.importTypes.map(type => 
    type.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Adds space between camelCase words
  );
}

// Add a getter for formatted filterOptions
get formattedFilterOptions(): string[] {
  return this.filterOptions.map(option => 
    option.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Adds space between camelCase words
  );
}

removeSpacesFromString(value: string): string {
  return value.replace(/\s+/g, ''); // Remove all spaces
}

  selectedImportType: string = '';
  filterData: string = '';
  dependVal: string = '';
  commaSeparatedItemss: string = '';
  selectedFilterBy: string = '';
  uploadedFileName: string | null = null;
  customPagination: Pagination = {
    total: '',
    recordsPerPage: 10,
    startIndex: 1,
    endIndex: 10,
  };
  
  sortColumn: SortColumn = {
    columnIndex: 1,
    sortOrder: 'desc',
  };

  public iAdminApiService: IAdminApiService;
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public Api: ApiFuntions,
    private authService: AuthService,
    public global:GlobalService, 
    private dialog: MatDialog,
    public adminApiService: AdminApiService,
    private localstorageService:LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,

    public dialogRef: MatDialogRef<ImportCountBatchesComponent>
  ) {
    this.iAdminApiService = adminApiService;
  }


  ngOnInit(): void {
   
    this.dataSource.data = [];
    this.filtersForm = new FormGroup({
      includeEmpty: new FormControl(false),  
      includeOther: new FormControl(false)   
    });
  }

  
  toggleRowSelection(row: PeriodicElement): void {
    console.log('Row selection toggled:', row);
  }

  
  close(): void {
    this.dialogRef.close();
  }

  nextStep() {
    this.countsUpdated.emit('next');
  }

   handlePageEvent(e: PageEvent) {
      this.pageEvent = e;
      this.customPagination.startIndex = e.pageSize * e.pageIndex;
      this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
      this.customPagination.recordsPerPage = e.pageSize;
    
    }

  onImportTypeChange(): void {
   
    this.selectedFilterBy = '';
    
   if (this.selectedImportType === this.ItemNumber) {
      this.dependVal = this.ItemNumber;
      this.filterOptions = ['Spreadsheet', this.ItemNumber];
    }
    else  if (this.selectedImportType === 'Location') {
      this.dependVal = 'Location';
      this.filterOptions = ['Spreadsheet', 'Location'];
      this.setLocationCheck(null,null);
    }  else {
       this.filterOptions = [];
    }

  }


  onFilterByChange(fileInput: HTMLInputElement): void {
 if (this.selectedFilterBy === 'Spreadsheet') {
      fileInput.value = '';
      fileInput.click(); 

  } else if (this.dependVal === this.ItemNumber) {
    this.uploadedFileName = ''; 
    this.openFilterItemNumbersDialog();
  } else if (this.dependVal === 'Location') {
  
    this.uploadedFileName = ''; 

    this.openFilterItemNumbersDialog();
  }
}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFileName = input.files[0].name;
    } else {
      this.selectedFilterBy = '';
      this.uploadedFileName = null;
     
    }
  }

 
  updateQueCountEvent(obj) {
    this.eventChange.emit(obj);
  }


  removeFile(): void {
    this.uploadedFileName = null;
    this.onImportTypeChange();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
     this.dataSource.data = [];
     if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  
  confirmImport(skipDialog: boolean = false): void {
    if (!this.uploadedFileName) {
      const includeEmpty = this.filtersForm.value.includeEmpty;
      const includeOther = this.filtersForm.value.includeOther;
      const filterdata = this.filterData;  // Ensure you have the correct filter data here
      const payload: { items: string; importBy: string, includeEmpty: boolean, includeOther: boolean } = {
        items: filterdata,  // Pass filterdata instead of commaSeparatedItems
        importBy: this.selectedImportType,
        includeEmpty: includeEmpty,
        includeOther: includeOther
      };
  
      this.iAdminApiService.GetImportBatchCount(payload).subscribe(
        (res: { isExecuted: boolean; data: any; responseMessage: string }) => {
          console.log('API Response:', res);
  
          if (res.isExecuted) {
          
            if (res.data && res.data.item2 && res.data.item2.length > 0) {
              this.updateTableData(res.data.item2);  
              console.log('Data updated successfully.');
            } else {
              
            }
          } else {
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            console.log('API Error Response:', res.responseMessage);
          }
        },
        (err: Error) => {
          console.error('Error importing batch count:', err);
          this.global.ShowToastr(ToasterType.Error, 'Failed to import data.', ToasterTitle.Error);
        }
      );
      return; 
    }
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

  if (fileInput?.files?.length) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as ArrayBuffer;
      const data = new Uint8Array(result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const excelData: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const itemsArray: string[] = excelData
        .flat()
        .filter((item) => item !== null && item !== '') as string[];

      const commaSeparatedItems = itemsArray.join(',');

      const includeEmpty = this.filtersForm.value.includeEmpty;
      const includeOther = this.filtersForm.value.includeOther;

      const payload: { items: string; importBy: string, includeEmpty: boolean, includeOther: boolean } = {
        items: commaSeparatedItems,
        importBy: this.selectedImportType,
        includeEmpty: includeEmpty,
        includeOther: includeOther
      };

      this.iAdminApiService.GetImportBatchCount(payload).subscribe(
        
        (res: { isExecuted: boolean; data: any; responseMessage: string }) => {
          console.log('API Response:', res);
      
          if (res.isExecuted) {
          
            if (res.data && res.data.item1 && res.data.item1.length > 0 && !skipDialog) {
              let heading = '';
              let message = '';
              let message2='';
             
              if (this.selectedImportType === 'Location') {
              
                  // for location exists in db
            if (res.data.item3 && res.data.item3.length > 0) {
          
              heading = 'Location(s) Not Found';
              message = `The following location(s) could not be imported as they are in another user's queue or have existing cycle count transactions: [${res.data.item3.join(', ')}]`;
  
              // for some location exists in db and some are not in db 
              if (res.data.item4 && res.data.item4.length > 0) 
              {
                message = `The following location(s) could not be imported as they are in another user's queue or have existing cycle count transactions: [${res.data.item3.join(', ')}]`;
                message2 =`The following location(s) do not exist: [${res.data.item4.join(', ')}]`;
              }  
  
            }
            else
            {
              // for not showing message dialog box if it is exists in empty locations
              if ((res.data.item3.length === 0) && (res.data.item4.length === 0)){
              this.dialogRef.close({ 
                filterItemNumbersText: this.data, 
                filterItemNumbersArray: itemsArray,
                filterData: commaSeparatedItems,
              });
              return
              }
              // for showing no location exists in db
              else {
              heading = 'Location(s) Not Found';
              message = `The following location(s) do not exist: [${res.data.item1.join(', ')}]`;
              }  
            }
            //heading = 'Location(s) Not Found';
            //message = `The following Locations do not exist [${res.data.item1.join(', ')}]`;
          }  
              else if (this.selectedImportType === this.ItemNumber) {
                heading = 'Item(s) Not Found';
                message = `The following Item Numbers do not exist [${res.data.item1.join(', ')}]`;
              
            }
            
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '560px',
                data: {
                  heading: heading,
                  message: message,
                  message2: message2,
                  buttonFields: false,
                  threeButtons: false,
                  singleButton: true,
                  customButtonText: false,
                  btn1Text: 'Ok',
                  hideCancel: true
                }
              });

              dialogRef.afterClosed().subscribe(() => {
                console.log('Dialog closed, proceeding with import.');
             
                if (res.data && res.data.item2 && res.data.item2.length > 0) {
                  this.updateTableData(res.data.item2);  
                  console.log('Data updated successfully.');
                } else {
                 
                }
              });
            } else if (res.data && res.data.item2 && res.data.item2.length > 0) {
            
              this.updateTableData(res.data.item2);
              console.log('Data updated successfully without dialog.');
            } else {
              
              console.log('No item2 data found in the API response.');
            }
          } else {
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            console.log('API Error Response:', res.responseMessage);
          }
        },
        (err: Error) => {
          console.error('Error importing batch count:', err);
          this.global.ShowToastr(ToasterType.Error, 'Failed to import data.', ToasterTitle.Error);
        }
      );
    };

    reader.readAsArrayBuffer(file);
  } else {
    this.global.ShowToastr(ToasterType.Error, "No file found.", ToasterTitle.Error);
  }
  }
  
  
openFilterItemNumbersDialog(): void {

    const dialogRef = this.dialog.open(FilterItemNumbersComponentCycleCount, {
      width: '600px',
      
      data: { 
        selectedImporttType: this.selectedImportType ?? "",
        includeEmpty:this.IncludeEmptyCheckedValue ?? false,
        includeOther:this.IncludeOtherCheckedValue ?? false,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      
      this.selectedFilterBy = '';
      if (result && result.responseData && result.filterData) {
          console.log('Filtered Item Numbers Response Data:', result.responseData);
          console.log('Filtered Data:', result.filterData);
          this.filterData=result.filterData;
         this.updateTableData(result.responseData);
      }
      if (result.filterData) {
       console.log('Filtered Data:', result.filterData);
      this.filterData=result.filterData;
      // this.updateTableData(result.responseData);
    }
    });
  }


  updateTableData(responseData: any[]): void {
    const mappedData: PeriodicElement[] = responseData.map(item => ({
      invMapID:item.invMapID,
      itemNumber: item.itemNumber,
      description: item.description,
      locationQuantity: Number(item.itemQuantity), 
      um: item.unitOfMeasure,
      warehouse: item.wareHouse || '',
      locations: item.location,
      velocityCode: item.cfVelocity || '',
      cellSize: item.cellSize,
      serialNumber: item.serialNumber,
      lotNumber: item.lotNumber,
      expirationDate: item.expirationDate || ''
    }));
    this.dataSource.data = mappedData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  insertCCQueue(ids: any) {
    const payLoad = {
      InvMapIDs: ids, 
    };
    this.iAdminApiService.CycleCountQueueInsert(payLoad).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.dataSourcee = [];
          this.selectedTabIndex = 1;
          this.nextStep();
          this.updateQueCountEvent(res.data);
          this.close();
          this.router.navigate([AppRoutes.AdminCreateCountBatches], { queryParams: { selectedIndex: 2 } });

        } else {
          
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("CycleCountQueueInsert",res.responseMessage);
          this.close();
        }
      },
      (error) => {}
    );
  }

  importToQueue() {

    let invMapIDs = new Array();
    let finaliter = Math.floor(this.dataSource.data.length / 1000);
    let curriter = 0;

    if (finaliter == 0) {
      this.dataSource.data.forEach((element) => {
        
        invMapIDs.push(element.invMapID);
      });

      this.insertCCQueue(invMapIDs);
    } else {
      this.dataSource.data.forEach((element) => {
        invMapIDs.push(element.invMapID);

        if (invMapIDs.length == 1000) {
          const payLoad = {
            InvMapIDs: invMapIDs, 
          };
          this.iAdminApiService
            .CycleCountQueueInsert(payLoad)
            .subscribe(
              (res: any) => {
                if (res.data && res.isExecuted) {
                  curriter++;
                  if (curriter == finaliter) {
                    if (invMapIDs.length > 0) {
                      this.insertCCQueue(invMapIDs);
                     
                      this.close();
                     
                    } else {
                      this.dataSourcee = [];
                      this.selectedTabIndex = 1;
                      this.close();
                    }
                  }
                } else {
                  
                  this.global.ShowToastr(ToasterType.Error,
                    ToasterMessages.SomethingWentWrong,
                    ToasterTitle.Error 
                  
                  );
                  console.log("CycleCountQueueInsert",res.responseMessage);
                  this.close();
                }
              },
              (error) => {}
            );
          invMapIDs = [];
        }
      });
    }

}

setLocationCheck(e:any, type:any)
  {
    let updatedValues=this.localstorageService.SetImportCountLocationChecks(e,type);
    this.filtersForm.controls['includeEmpty'].setValue(updatedValues[0]);
    this.IncludeEmptyCheckedValue=updatedValues[0];
    this.filtersForm.controls['includeOther'].setValue(updatedValues[1]);
    this.IncludeEmptyCheckedValue=updatedValues[1];
    
    this.dataSource.data = [];
    this.confirmImport(true);
  }


}
