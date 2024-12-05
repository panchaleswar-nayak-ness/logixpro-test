import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
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
  sortOrder: 'asc' | 'desc'; // Use union type for better type safety
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

  dataSource = new MatTableDataSource<PeriodicElement>();
  placeholders = Placeholders;
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
  dataSourcee: PeriodicElement[] = [];


  importTypes: string[] = ['Location', 'ItemNumber'];
  filterOptions: string[] = ['Spreadsheet', 'ItemNumber'];

  selectedImportType: string = '';
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
    public Api: ApiFuntions,
    private authService: AuthService,
    public global:GlobalService, 
    private dialog: MatDialog,
    public adminApiService: AdminApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ImportCountBatchesComponent>
  ) {
    this.iAdminApiService = adminApiService;
  }


  ngOnInit(): void {
    
    this.dataSource.data = [];
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

  onImportTypeChange(): void {
    this.selectedFilterBy = '';
  }

  onFilterByChange(fileInput: HTMLInputElement): void {
    if (this.selectedFilterBy === 'Spreadsheet') {
      fileInput.click(); 
    } else if (this.selectedFilterBy === 'ItemNumber') {
      this.uploadedFileName = ''; 
      this.openFilterItemNumbersDialog();
    }
  }
  


  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.uploadedFileName = input.files[0].name;
    } else {
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
  }
  
  confirmImport(): void {
    if (!this.uploadedFileName) {
      this.global.ShowToastr(ToasterType.Error, "No file uploaded.", ToasterTitle.Error);
      return;
    }
  
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  
    if (fileInput?.files?.length) {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      // Read the Excel file
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Convert sheet to JSON with header
        const excelData: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        // Flatten and filter the data to get non-null, non-empty items
        const itemsArray: string[] = excelData
          .flat()
          .filter((item) => item !== null && item !== '') as string[];
  
        const commaSeparatedItems = itemsArray.join(',');
        console.log("Values from Excel:", commaSeparatedItems);
  
        // Define payload type
        const payload: { items: string; importBy: string } = {
          items: commaSeparatedItems,
          importBy: this.selectedImportType,
        };
  
        this.iAdminApiService.GetImportBatchCount(payload).subscribe(
          (res: { isExecuted: boolean; data: any[]; responseMessage: string }) => {
            console.log('API Response:', res);
            if (res.isExecuted) {
              if (res.data && res.data.length > 0) {
                // Map the response data to the table
                this.updateTableData(res.data);
                console.log('Data updated successfully.');
              } else {
                // Handle empty data array
                this.global.ShowToastr(ToasterTitle.Warning, "No data available.", ToasterTitle.Warning);
                console.log('No data found in the API response.');
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
        selectedImporttType: this.selectedImportType 
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.responseData) {
        console.log('Filtered Item Numbers Response Data:', result.responseData);
     
        this.updateTableData(result.responseData);
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
      locations: item.generatedLocation,
      velocityCode: item.cfVelocity || '',
      cellSize: item.cellSize,
      serialNumber: item.serialNumber,
      lotNumber: item.lotNumber,
      expirationDate: item.expirationDate || ''
    }));
    this.dataSource.data = mappedData;
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
}
