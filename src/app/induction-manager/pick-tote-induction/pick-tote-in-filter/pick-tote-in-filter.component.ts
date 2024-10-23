import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, Subscription } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-pick-tote-in-filter',
  templateUrl: './pick-tote-in-filter.component.html',
  styleUrls: ['./pick-tote-in-filter.component.scss'],
})
export class PickToteInFilterComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PickToteInFilterComponent>,
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService,
    public dialog: MatDialog 
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  aliasFilterList = [{ colHeader: '', colDef: '', startCharacter: 0, endCharacter: 0 }];
  displayedColumns: string[] = ['field', 'fieldValue', 'actions'];
  elementData = [{ field: 'Zone 1' }];
  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  apiFilterData: PickToteInductionFilter[] = [];
  subscription: Subscription[];

  ngOnInit(): void {
    this.GetPickToteInductionFilterData();
    this.initializeRows(); // Initialize table rows independently of the API response

    if (this.data?.ColumnFilter.length > 0)
      this.filters = this.data.ColumnFilter;
  }

  ngOnDestroy(): void {

  }

  // Initialize table with empty rows, not based on API response
  initializeRows() {
    const initialRows: PickToteInductionFilter[] = [
      {
        id: 0,
        alias: '',
        ppField: '',
        startCharacter: 0,
        endCharacter: 0,
        Value: '',
      },
    ];
    this.filters = initialRows;
  }

  // Method to add a new row
  addRow() {
    const newRow: PickToteInductionFilter = {
      id: 0, // Temporary ID; will be set from API data
      alias: '', // Will be set based on ppField selection
      ppField: '', // User selects this
      startCharacter: 0, // Will be set from API data
      endCharacter: 0, // Will be set from API data
      Value: '', // User inputs this
    };

    this.filters = [newRow, ...this.filters];
  }

  removeRow(index: number) {
    if (this.filters.length >= 1) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '460px',
        disableClose: true,
        data: {
          actionMessage: ` this filter row`,
          action: 'delete',
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {  // Proceed only if the user confirms
          this.filters.splice(index, 1); // Remove row from the filters array
          this.filters = [...this.filters]; // Trigger change detection
        }
      });
    }
  }

  GetPickToteInductionFilterData() {
    this.iInductionManagerApi
      .GetPickToteInductionFilter()
      .subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          // Store the complete API data
          this.apiFilterData = res.data;

          // Populate aliasFilterList with alias values from API
          this.aliasFilterList = this.apiFilterData.map((item: any) => ({
            colHeader: item.ppField,
            colDef: item.alias,
            startCharacter: item.startCharacter,
            endCharacter: item.endCharacter
          }));
        }
      });
  }

  selectionChange(value: any, filter: any) {
    const filterSelected = this.aliasFilterList.find(x => x.colDef === value);
    if (filterSelected !=null) {
    filter.startCharacter = filterSelected.startCharacter;
    filter.endCharacter = filterSelected.endCharacter;
    }
  }

  applyFilter() {
    this.filters.forEach((value) => {
      let filterBySelectedValue = this.apiFilterData.find(
        (f) => f.alias === value.alias
      );
      value.ppField = filterBySelectedValue?.ppField;
    });

    this.dialogRef.close(this.filters);
    // You can now send `finalFilters` to your backend API or use it as needed
  }

  close() {
    this.filters = [];
    this.dialogRef.close(this.filters);
  }
}
