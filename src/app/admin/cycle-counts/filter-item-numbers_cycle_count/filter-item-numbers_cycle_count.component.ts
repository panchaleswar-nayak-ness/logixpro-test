import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { LocalStorageService } from 'src/app/common/services/LocalStorage.service';
import { CycleCountConfirmMessageDialogComponent } from '../../dialogs/cycle-count-confirm-message-dialog/cycle-count-confirm-message-dialog.component';
import { CommonResponse, WorkstationItems, WorkstationLocations } from 'src/app/common/Model/cycle-count';
@Component({
  selector: 'app-filter-item-numbers',
  templateUrl: './filter-item-numbers_cycle_count.component.html',
  styleUrls: ['./filter-item-numbers_cycle_count.component.scss'],
})
export class FilterItemNumbersComponentCycleCount implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  public userData: any;
  public iAdminApiService: IAdminApiService;
  importtype: string = '';
  items: string = '';
  public includeEmpty: boolean = false;
  public includeOther: boolean = false;
  titleText: string = 'Filter Item Numbers';
  instructionsText: string =
    'This is used to copy and paste item numbers from an excel spreadsheet.';

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public adminApiService: AdminApiService,
    private authService: AuthService,
    private localstorageService: LocalStorageService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.importtype = this.data.selectedImporttType ?? "'";
    this.userData = this.authService.userData();
    // Check if importtype is 'Location' and update the text accordingly
    if (this.importtype === 'Location') {
      this.titleText = 'Filter Locations';
      this.instructionsText =
        'This is used to copy and paste Locations from an excel spreadsheet.';
      this.includeEmpty = this.data.includeEmpty;
      this.includeOther = this.data.includeOther;
    } else {
      this.titleText = `Filter ${this.itemNumber}s`;
      this.instructionsText =
        'This is used to copy and paste item numbers from an excel spreadsheet.';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  filterItemNumbers(): void {
    let itemsStr = this.items
    .split(/[\n\r]+/)              // Split by new lines
    .map(item => item.trim())      // Trim each item to remove starting/trailing spaces
    .filter(item => item !== '')   // Remove empty lines if any
    .join(',');                    // Join into a comma-separated string
      let itemsArray = itemsStr.split(',');
    itemsArray = itemsArray.filter((item: any) => item != '');
    let commaSeparatedItems = itemsArray.join(',');
    let updatedValues = this.localstorageService.SetImportCountLocationChecks(
      null,
      null
    );
    this.includeEmpty = updatedValues[0];
    this.includeOther = updatedValues[1];
    let payload: any = {
      items: commaSeparatedItems,
      importBy: this.importtype,
      includeEmpty: this.includeEmpty ? this.includeEmpty : false,
      includeOther: this.includeOther ? this.includeOther : false,
    };
    this.adminApiService.GetImportBatchCount(payload).subscribe((res: CommonResponse) => {
      if (res.isExecuted && res.data) {
        let heading = '';
        let notFoundLocations: string[] = [];
        let cycleCountLocations: string[] = [];
        let workstationGroups: WorkstationLocations[] = [];
        let notFoundItems: string[] = [];
        let cycleCountItems: string[] = [];
        let itemWorkstationGroups: WorkstationItems[] = [];
    
        if (this.importtype === 'Location') {
          if (
            (res.data.locationExistsList && res.data.locationExistsList.length > 0) ||
            (res.data.locationWithWSNameList && res.data.locationWithWSNameList.length > 0)
          ) {
            heading = 'Location(s) Not Found';
            cycleCountLocations = res.data.locationExistsList || [];
            workstationGroups = res.data.locationWithWSNameList || [];
    
            if (res.data.locationNotExistsList && res.data.locationNotExistsList.length > 0) {
              notFoundLocations = res.data.locationNotExistsList;
            }
          } else if (
            (res.data.locationExistsList?.length === 0) &&
            (res.data.locationNotExistsList?.length === 0) &&
            (res.data.locationWithWSNameList?.length === 0)
          ) {
            this.dialogRef.close({
              filterItemNumbersText: this.data,
              filterItemNumbersArray: itemsArray,
              filterData: commaSeparatedItems,
            });
          } else {
            heading = 'Location(s) Not Found';
            notFoundLocations = res.data.missingValues || [];
          }
        } else if (this.importtype === this.itemNumber) {
          if (
            (res.data.itemNumberExistsList && res.data.itemNumberExistsList.length > 0) ||
            (res.data.itemNumberWithWSNameList && res.data.itemNumberWithWSNameList.length > 0)
          ) {
            heading = `Item(s) Not Found`;
            cycleCountItems = res.data.itemNumberExistsList || [];
            itemWorkstationGroups = res.data.itemNumberWithWSNameList || [];
    
            if (res.data.itemNumberNotExistsList && res.data.itemNumberNotExistsList.length > 0) {
              notFoundItems = res.data.itemNumberNotExistsList;
            }
          } else if (
            (res.data.itemNumberExistsList?.length === 0) &&
            (res.data.itemNumberNotExistsList?.length === 0) &&
            (res.data.itemNumberWithWSNameList?.length === 0)
          ) {
            this.dialogRef.close({
              filterItemNumbersText: this.data,
              filterItemNumbersArray: itemsArray,
              filterData: commaSeparatedItems,
            });
          } else {
            heading = `Item(s) Not Found`;
            notFoundItems = res.data.missingValues || [];
          }
        }
    
        if (
          notFoundLocations.length > 0 ||
          cycleCountLocations.length > 0 ||
          workstationGroups.length > 0 ||
          notFoundItems.length > 0 ||
          cycleCountItems.length > 0 ||
          itemWorkstationGroups.length > 0
        ) {
          const dialogRef = this.dialog.open(CycleCountConfirmMessageDialogComponent, {
            width: '560px',
            data: {
              heading: heading,
              importType: this.importtype,
              notFoundLocations: notFoundLocations,
              cycleCountLocations: cycleCountLocations,
              workstationGroups: workstationGroups,
              notFoundItems: notFoundItems,
              cycleCountItems: cycleCountItems,
              itemWorkstationGroups: itemWorkstationGroups
            }
          });
    
          dialogRef.afterClosed().subscribe(() => {
            this.dialogRef.close();
            if (res.data.inventoryList && res.data.inventoryList.length > 0) {
              const tableData = res.data.inventoryList.map((item: any) => ({
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
                responseData: [],
                filterData: commaSeparatedItems,
              });
            }
          });
        } else if (res.data.inventoryList && res.data.inventoryList.length > 0) {
          const tableData = res.data.inventoryList.map((item: any) => ({
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
            responseData: [],
            filterData: commaSeparatedItems,
          });
        }
      } else {
        console.log('FiltersItemNumInsert Error:', res.responseMessage);
      }
    });
  }
}
