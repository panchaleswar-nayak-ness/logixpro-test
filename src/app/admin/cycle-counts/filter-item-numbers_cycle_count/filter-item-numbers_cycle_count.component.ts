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
  instructionsText: string = 'This is used to copy and paste item numbers from an excel spreadsheet.';

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
   
    let itemsStr = this.items.trim().replace(/[\n\r]/g, ',');
    let itemsArray = itemsStr.split(',');
    itemsArray = itemsArray.filter((item: any) => item != "");
    let commaSeparatedItems = itemsArray.join(',');
    let payload: any = { 
      "items": commaSeparatedItems,
      "importBy": this.importtype,
      "includeEmpty": this.includeEmpty,  
      "includeOther": this.includeOther   
    };
  
   
    this.adminApiService.GetImportBatchCount(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        
        if (res.data.item1 && res.data.item1.length > 0) {
          let heading = '';
          let message = '';
          
        
          if (this.importtype === 'Location') {
            heading = 'Location(s) Not Found';
            message = `The following numbers do not exist [${res.data.item1.join(', ')}]`;
          } else if (this.importtype === 'Item Number') {
            heading = 'Item(s) Not Found';
            message = `The following numbers do not exist [${res.data.item1.join(', ')}]`;
          }
  
       
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
  
         
          dialogRef.afterClosed().subscribe(() => {
             this.dialogRef.close();
         
            if (res.data.item2 && res.data.item2.length > 0) {
            
              const tableData = res.data.item2.map((item: any) => ({
                invMapID: item.invMapID,
                itemNumber: item.itemNumber,
                description: item.description.trim(), 
                itemQuantity: item.itemQuantity,
                unitOfMeasure: item.unitOfMeasure,
                wareHouse: item.wareHouse || 'N/A',
                generatedLocation: item.generatedLocation,
                cellSize: item.cellSize,
                serialNumber: item.serialNumber,
                lotNumber: item.lotNumber,
                location: item.location,
                expirationDate: item.expirationDate || 'N/A', 
              }));
  
              
              this.dialogRef.close({ 
                filterItemNumbersText: this.data, 
                filterItemNumbersArray: itemsArray,
                responseData: tableData, 
                filterData: commaSeparatedItems,
              });
            } else {
             
            }
          });
        } else {
         
          if (res.data.item2 && res.data.item2.length > 0) {
            
            const tableData = res.data.item2.map((item: any) => ({
              invMapID: item.invMapID,
                itemNumber: item.itemNumber,
                description: item.description.trim(), 
                itemQuantity: item.itemQuantity,
                unitOfMeasure: item.unitOfMeasure,
                wareHouse: item.wareHouse || 'N/A', 
                generatedLocation: item.generatedLocation,
                cellSize: item.cellSize,
                serialNumber: item.serialNumber,
                lotNumber: item.lotNumber,
                location: item.location,
                expirationDate: item.expirationDate || 'N/A', 
            }));
  
           
            this.dialogRef.close({ 
              filterItemNumbersText: this.data, 
              filterItemNumbersArray: itemsArray,
              responseData: tableData, 
              filterData: commaSeparatedItems,
            });
          } else {
           
          }
        }
      } else {
        console.log('FiltersItemNumInsert Error:', res.responseMessage);
      }
    });
  }
  
  
  
}

