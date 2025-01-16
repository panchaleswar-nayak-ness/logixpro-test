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
      this.includeEmpty=this.data.includeEmpty;
      this.includeOther=this.data.includeOther
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
          let message2 = '';

          if (this.importtype === 'Location') {
            
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
          } else if (this.importtype === 'Item Number') {
            heading = 'Item(s) Not Found';
            message = `The following Item Number(s) do not exist [${res.data.item1.join(', ')}]`;
          }
  
       
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '560px',
            data: {
              heading: heading,
              message: message,
              message2:message2,
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
              this.dialogRef.close({ 
                filterItemNumbersText: this.data, 
                filterItemNumbersArray: itemsArray,
                //responseData: tableData, 
                filterData: commaSeparatedItems,
              });
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

