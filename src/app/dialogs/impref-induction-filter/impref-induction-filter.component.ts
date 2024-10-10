import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { AddPickToteInductionFilter, PickToteInductionFilter } from 'src/app/induction-manager/models/PickToteInductionModel';

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

  public iInductionManagerApi: IInductionManagerApiService;
  constructor(
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService,
    public dialogRef: MatDialogRef<ImprefInductionFilterComponent> // Inject MatDialogRef here



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
    this.filters = [{ id: 0, alias: '', ppField: '', startCharacter: 0, endCharacter: 0 },...this.filters];
  }

  GetPickToteInductionFilterData() {
    this.iInductionManagerApi.GetPickToteInductionFilter().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.filters = res.data;
      }
    });
  }
  // Save the filter at the specified index
  saveFilter(filter: PickToteInductionFilter): void {
    this.iInductionManagerApi.AddPickToteInductionFilter(filter).subscribe(response => {
      if (response.isExecuted) {
        this.GetPickToteInductionFilterData();
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

  // Remove the filter at the specified index
  removeFilter(filter: PickToteInductionFilter): void {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
      this.filters = [...this.filters]; // Re-assign to a new array reference
    }
    if(filter.id >0){
      this.iInductionManagerApi.DeletePickToteInductionFilter([filter.id]).subscribe((response: any) => {
        if (response.isExecuted) {
          this.GetPickToteInductionFilterData();
          this.global.ShowToastr(
            ToasterType.Success,
            'Record have been Deleted',
            ToasterTitle.Success
          );
        }else{
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        }
      }); 
    }
  }
    
  removeAllFilters(): void {
    // Call the API to delete all filters
    const ids = this.filters.map(filter => filter.id);
    this.iInductionManagerApi.DeletePickToteInductionFilter(ids).subscribe((response: any) => {
      if (response.isExecuted) {
        // Clear the filters array locally
        this.filters = [];
        this.global.ShowToastr(
          ToasterType.Success,
          'All filters have been removed',
          ToasterTitle.Success
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }
  
  onSubmit(): void {
    this.dialogRef.close(); // This will close the dialog when submit is clicked
    
  }
}
