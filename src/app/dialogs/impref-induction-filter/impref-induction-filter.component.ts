import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogConstants, ResponseStrings, Style, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { AddPickToteInductionFilter, PickToteInductionFilter } from 'src/app/induction-manager/models/PickToteInductionModel';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-impref-induction-filter',
  templateUrl: './impref-induction-filter.component.html',
  styleUrls: ['./impref-induction-filter.component.scss']
})
export class ImprefInductionFilterComponent implements OnInit {

  TRNSC_DATA =[
    { colHeader: 'id', colDef: 'ID' },
    { colHeader: 'importDate', colDef: 'Import Date' },
    { colHeader: 'importBy', colDef: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename' },
    { colHeader: 'transactionType', colDef: 'Transaction Type' },
    { colHeader: 'orderNumber', colDef: 'Order Number' },
    { colHeader: 'lineNumber', colDef: 'Line Number' },
    { colHeader: 'lineSequence', colDef: 'Line Sequence' },
    { colHeader: 'priority', colDef: 'Priority' },
    { colHeader: 'requiredDate', colDef: 'Required Date' },
    { colHeader: 'itemNumber', colDef: 'Item Number' },
    { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure' },
    { colHeader: 'lotNumber', colDef: 'Lot Number' },
    { colHeader: 'expirationDate', colDef: 'Expiration Date' },
    { colHeader: 'serialNumber', colDef: 'Serial Number' },
    { colHeader: 'description', colDef: 'Description' },
    { colHeader: 'revision', colDef: 'Revision' },
    { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' },
    { colHeader: 'location', colDef: 'Location' },
    { colHeader: 'wareHouse', colDef: 'Warehouse' },
    { colHeader: 'zone', colDef: 'Zone' },
    { colHeader: 'carousel', colDef: 'Carousel' },
    { colHeader: 'row', colDef: 'Row' },
    { colHeader: 'shelf', colDef: 'Shelf' },
    { colHeader: 'bin', colDef: 'Bin' },
    { colHeader: 'invMapID', colDef: 'Inv Map ID' },
    { colHeader: 'completedDate', colDef: 'Completed Date' },
    { colHeader: 'completedBy', colDef: 'Completed By' },
    { colHeader: 'completedQuantity', colDef: 'Completed Quantity' },
    { colHeader: 'batchPickID', colDef: 'Batch Pick ID' },
    { colHeader: 'notes', colDef: 'Notes' },
    { colHeader: 'exportFileName', colDef: 'Export File Name' },
    { colHeader: 'exportDate', colDef: 'Export Date' },
    { colHeader: 'exportedBy', colDef: 'Exported By' },
    { colHeader: 'exportBatchID', colDef: 'Export Batch ID' },
    { colHeader: 'tableType', colDef: 'Table Type' },
    { colHeader: 'statusCode', colDef: 'Status Code' },
    { colHeader: 'masterRecord', colDef: 'Master Record' },
    { colHeader: 'masterRecordID', colDef: 'Master Record ID' },
    { colHeader: 'label', colDef: 'Label' },
    { colHeader: 'inProcess', colDef: 'In Process' },
    { colHeader: 'userField1', colDef: 'User Field1' },
    { colHeader: 'userField2', colDef: 'User Field2' },
    { colHeader: 'userField3', colDef: 'User Field3' },
    { colHeader: 'userField4', colDef: 'User Field4' },
    { colHeader: 'userField5', colDef: 'User Field5' },
    { colHeader: 'userField6', colDef: 'User Field6' },
    { colHeader: 'userField7', colDef: 'User Field7' },
    { colHeader: 'userField8', colDef: 'User Field8' },
    { colHeader: 'userField9', colDef: 'User Field9' },
    { colHeader: 'userField10', colDef: 'User Field10' },
    { colHeader: 'toteID', colDef: 'Tote ID' },
    { colHeader: 'toteNumber', colDef: 'Tote Number' },
    { colHeader: 'cell', colDef: 'Cell' },
    { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID' },
    { colHeader: 'emergency', colDef: 'Emergency' },
  ];
  filters: PickToteInductionFilter[] = [];
  
  originalFilters: PickToteInductionFilter[] = [];

  public iInductionManagerApi: IInductionManagerApiService;
  constructor(
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService,
    public dialogRef: MatDialogRef<ImprefInductionFilterComponent>, // Inject MatDialogRef here
    public dialog: MatDialog
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.GetPickToteInductionFilterData();
   
  }

  selectionChange(event) {
    console.log(event);
  }
  // Add a new empty filter
  addFilter(): void {
    this.filters = [{ id: 0, alias: '', ppField: '', startCharacter: 1, endCharacter: 0 },...this.filters];
  }

  GetPickToteInductionFilterData() {
    this.iInductionManagerApi.GetPickToteInductionFilter().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.filters = res.data;
        this.originalFilters = JSON.parse(JSON.stringify(res.data))
      }
    });
  }

  isFilterModified(filter: PickToteInductionFilter): boolean {
    // Treat new filters (id = 0) as modified
    if (filter.id === 0) {
      return true;
    }
  
    const originalFilter = this.originalFilters.find(f => f.id === filter.id);
  
    // Return false if no matching original filter is found
    if (!originalFilter) {
      return false;
    }
  
    // Compare filter properties to detect modifications
    return (
      filter.alias !== originalFilter.alias ||
      filter.ppField !== originalFilter.ppField ||
      filter.startCharacter !== originalFilter.startCharacter ||
      filter.endCharacter !== originalFilter.endCharacter
    );
  }
  // Save the filter at the specified index
  saveFilter(filter: PickToteInductionFilter): void {
    const duplicateFilters = this.filters.filter((item: any) => {
      return (
        item.ppField===filter.ppField &&
        item.alias === filter.alias &&
        item.startCharacter === filter.startCharacter &&
        item.endCharacter === filter.endCharacter
      );
    });
  
  
    // If duplicates exist, show error toast and prevent API call
    if (duplicateFilters.length > 1) {
      this.global.ShowToastr(
        ToasterType.Error,
        'Duplicate filter found. Please remove duplicates.',
        ToasterTitle.Error
      );
      return; // Stop execution to prevent the save
    }
    this.iInductionManagerApi.AddPickToteInductionFilter(filter).subscribe(response => {
      if (response.isExecuted) {
        //this.GetPickToteInductionFilterData();
        filter.id = response.data.id;
        //this.originalFilters = JSON.parse(JSON.stringify(this.filters));
        let originalFilter = this.originalFilters.find(x => x.id === response.data.id);
        if ( originalFilter)
        {
          originalFilter.Value = filter.Value;
          originalFilter.alias = filter.alias;
          originalFilter.endCharacter= filter.endCharacter;
          originalFilter.startCharacter = filter.startCharacter;
          originalFilter.ppField = filter.ppField;
        }
        this.global.ShowToastr(
          ToasterType.Success,
          'Your details have been updated',
          ToasterTitle.Success
        );
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }

    });
  }

  removeFilter(filter: PickToteInductionFilter): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '460px', // Set a custom width for the dialog if needed
      disableClose: true, // Disable closing by clicking outside
      data: {
        actionMessage: ` this filter`,
        action: 'delete',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        const index = this.filters.indexOf(filter);
        if (index !== -1) {
          this.filters.splice(index, 1);
          this.filters = [...this.filters]; // Reassign to trigger change detection
          if (filter.id > 0) { // If filter exists on the server, delete it via API
            this.iInductionManagerApi.DeletePickToteInductionFilter([filter.id]).subscribe((response: any) => {
              if (response.isExecuted) {
                //this.GetPickToteInductionFilterData();
                this.global.ShowToastr(
                  ToasterType.Success,
                  'Filter has been deleted',
                  ToasterTitle.Success
                );
              } else {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              }
            });
          }
        }
      }
    });
  }
    
  removeAllFilters(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '460px',
      disableClose: true,
      data: {
        actionMessage: ' all filters',
        action: 'remove',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        const ids = this.filters.map(filter => filter.id);
        this.iInductionManagerApi.DeletePickToteInductionFilter(ids).subscribe((response: any) => {
          if (response.isExecuted) {
            this.filters = []; // Clear all filters locally
            this.global.ShowToastr(
              ToasterType.Success,
              'All filters have been deleted',
              ToasterTitle.Success
            );
          } else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          }
        });
      }
    });
  }
  onSubmit(): void {
    let isConfirmationRequired = false;
    this.filters.forEach(element => {
      if (this.isFilterModified(element)) {
        isConfirmationRequired = true;
      }
    });
      if (isConfirmationRequired)
        this.ConfirmationDialog();
      else
        this.dialogRef.close();
  }

  
  async ConfirmationDialog() { 
    const dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      data: {
        message: 'Changes you made may not be saved.',
        heading: 'Pick Tote Induction Filters'
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === ResponseStrings.Yes) { 
        this.dialogRef.close(); // This will close the dialog when submit is clicked
      } else {
        
      }
    });
  }
}
