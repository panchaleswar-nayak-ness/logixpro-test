import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pick-tote-in-filter',
  templateUrl: './pick-tote-in-filter.component.html',
  styleUrls: ['./pick-tote-in-filter.component.scss'],
})
export class PickToteInFilterComponent implements OnInit {
  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  apiFilterData: PickToteInductionFilter[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PickToteInFilterComponent>,
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService
  ) {

    this.iInductionManagerApi = inductionManagerApi;
  }

  aliasFilterList = [{ colHeader: '', colDef: '' }];
  displayedColumns: string[] = ['select', 'field', 'fieldValue', 'actions'];
  elementData = [{ field: 'Zone 1' }];

  ngOnInit(): void {
    this.GetPickToteInductionFilterData();
    this.initializeRows(); // Initialize table rows independently of the API response
    if (this.data?.length > 0) this.filters = this.data;
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

  // Method to remove a row
  removeRow(index: number) {
    if (this.filters.length > 1) {
      this.filters.splice(index, 1); // Remove row from the filters array
      this.filters = [...this.filters]; // Trigger change detection
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
            colHeader: item.alias,
            colDef: item.alias,
          }));
        }
      });
  }
  
  selectionChange(value: any) {
    console.log('Selected value:', value);
  }

  applyFilter() {
  
    console.log('selected data : ', this.filters);
  
    this.filters.forEach((filter) => {
      // Find the corresponding API data based on ppField selection
      const apiData = this.apiFilterData.find(
        (api) => api.alias === filter.ppField
      );
      if (apiData) {
        filter.startCharacter = apiData.startCharacter;
        filter.endCharacter = apiData.endCharacter;
        (filter.alias = apiData.alias), (filter.ppField = apiData.ppField);
      } else {
        // Handle the case where ppField does not match any API data
        console.log(`No API data found for ppField: ${filter.ppField}`);
      }
    });

    this.dialogRef.close(this.filters);
    // You can now send `finalFilters` to your backend API or use it as needed
  }
}
