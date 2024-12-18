import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-filter-item-numbers',
  templateUrl: './filter-item-numbers_cycle_count.component.html',
  styleUrls: ['./filter-item-numbers_cycle_count.component.scss']
})
export class FilterItemNumbersComponentCycleCount implements OnInit {
  @ViewChild('filter_text') filterText: ElementRef;
  public userData: any;
  public iAdminApiService: IAdminApiService;
  importtype : string = '';
  items : string = '';
  public includeEmpty: boolean = false;  
  public includeOther: boolean = false;  
  titleText: string = 'Filter Item Numbers'; 
  instructionsText: string = 'This is used to copy and paste item numbers from an excel spreadsheet.'; // Default instructions

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService,
  ) {
    this.iAdminApiService = adminApiService;
   }

   ngOnInit(): void {
    this.importtype = this.data.selectedImporttType ?? "'";
     console.log("Received value:", this.data.selectedImporttType);
    
    this.userData = this.authService.userData();
  
    // Check if importtype is 'Location' and update the text accordingly
    if (this.importtype === 'Location') {
      this.titleText = 'Filter Locations';
      this.instructionsText = 'This is used to copy and paste Locations from an excel spreadsheet.';
    } else {
      this.titleText = 'Filter Item Numbers';
      this.instructionsText = 'This is used to copy and paste item numbers from an excel spreadsheet.';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.filterText.nativeElement.focus();
  }
  filterItemNumbers(): void {
    // Step 1: Clean and split the input data
    let itemsStr = this.items.trim().replace(/[\n\r]/g, ',');
    let itemsArray = itemsStr.split(',');
    itemsArray = itemsArray.filter((item: any) => item != "");
  
    // Step 2: Prepare the comma-separated string of items
    let commaSeparatedItems = itemsArray.join(',');
  
    // Step 3: Prepare payload with includeEmpty and includeOther filters
    let payload: any = { 
      "items": commaSeparatedItems,
      "importBy": this.importtype,
      "includeEmpty": this.includeEmpty,  
      "includeOther": this.includeOther   
    };
  
    // Step 4: Make the API request to get import batch count
    this.adminApiService.GetImportBatchCount(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        // Step 5: Check if item1 is not empty and show the confirmation dialog first
        if (res.data.item1 && res.data.item1.length > 0) {
          let heading = '';
          let message = '';
          
          // Set the heading and message based on import type
          if (this.importtype === 'Location') {
            heading = 'Location(s) Not Found';
            message = `The following location(s) were not found in the system: [${res.data.item1.join(', ')}]`;
          } else if (this.importtype === 'Item Number') {
            heading = 'Item(s) Not Found';
            message = `The following item(s) were not found in the system: [${res.data.item1.join(', ')}]`;
          }
  
          // Open the confirmation dialog with the item1 message
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '560px',
            data: {
              heading: heading,
              message: message,
              buttonFields: false,
              threeButtons: false,
              singleButton: true,
              customButtonText: false,
              btn1Text: 'Ok',
              hideCancel: true
            }
          });
  
          // After the dialog is closed, proceed with checking item2
          dialogRef.afterClosed().subscribe(() => {
            // Step 6: Check if item2 exists and update table data
            if (res.data.item2 && res.data.item2.length > 0) {
              // Map the response data to the table format
              const tableData = res.data.item2.map((item: any) => ({
                invMapID: item.invMapID,
                itemNumber: item.itemNumber,
                description: item.description.trim(), // Trim spaces if necessary
                locationQuantity: item.itemQuantity,
                um: item.unitOfMeasure,
                warehouse: item.wareHouse || 'N/A', // Handle empty values with default 'N/A'
                locations: item.generatedLocation,
                velocityCode: item.cellSize,
                cellSize: item.cellSize,
                serialNumber: item.serialNumber,
                lotNumber: item.lotNumber,
                expirationDate: item.expirationDate || 'N/A', // Handle empty values with default 'N/A'
              }));
  
              // Step 7: Pass data and return it to the dialog or set it to the table
              this.dialogRef.close({ 
                filterItemNumbersText: this.data, 
                filterItemNumbersArray: itemsArray,
                responseData: tableData, // Pass mapped table data here
                filterData: commaSeparatedItems,
              });
            } else {
             
            }
          });
        } else {
          // Step 7: If item1 is empty, continue with checking item2 and updating table data
          if (res.data.item2 && res.data.item2.length > 0) {
            // Map the response data to the table format
            const tableData = res.data.item2.map((item: any) => ({
              invMapID: item.invMapID,
              itemNumber: item.itemNumber,
              description: item.description.trim(), // Trim spaces if necessary
              locationQuantity: item.itemQuantity,
              um: item.unitOfMeasure,
              warehouse: item.wareHouse || 'N/A', // Handle empty values with default 'N/A'
              locations: item.generatedLocation,
              velocityCode: item.cellSize,
              cellSize: item.cellSize,
              serialNumber: item.serialNumber,
              lotNumber: item.lotNumber,
              expirationDate: item.expirationDate || 'N/A', // Handle empty values with default 'N/A'
            }));
  
            // Step 8: Set the table data directly without dialog
            this.dialogRef.close({ 
              filterItemNumbersText: this.data, 
              filterItemNumbersArray: itemsArray,
              responseData: tableData, // Pass mapped table data here
              filterData: commaSeparatedItems,
            });
          } else {
           
          }
        }
      } else {
        // Step 9: Handle error case
        this.global.ShowToastr('error', res.responseMessage, 'Error');
        console.log('FiltersItemNumInsert Error:', res.responseMessage);
      }
    });
  }
  
  
  
}

