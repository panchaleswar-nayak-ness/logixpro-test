import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterItemNumbersComponent } from '../../dialogs/filter-item-numbers/filter-item-numbers.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
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

@Component({
  selector: 'app-import-count-batches',
  templateUrl: './import-count-batches.component.html',
  styleUrls: ['./import-count-batches.component.scss'],
})
export class ImportCountBatchesComponent implements OnInit {
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

  elementData: PeriodicElement[] = [
    {
      itemNumber: '12345',
      description: 'Sample Item 1',
      locationQuantity: 50,
      um: 'EA',
      warehouse: 'Main Warehouse',
      locations: 'A1',
      velocityCode: 'V1',
      cellSize: 'Medium',
      serialNumber: 'SN12345',
      lotNumber: 'LN123',
      expirationDate: '2024-12-31',
    },
    {
      itemNumber: '67890',
      description: 'Sample Item 2',
      locationQuantity: 30,
      um: 'BX',
      warehouse: 'Secondary Warehouse',
      locations: 'B2',
      velocityCode: 'V2',
      cellSize: 'Small',
      serialNumber: 'SN67890',
      lotNumber: 'LN456',
      expirationDate: '2025-01-15',
    },
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(this.elementData);

  // Dropdown options
  importTypes: string[] = ['Location', 'Item Number'];
  filterOptions: string[] = ['Spreadsheet', 'Item Number'];

  // Selected dropdown values
  selectedImportType: string = '';
  selectedFilterBy: string = '';


  // Uploaded file placeholder
  uploadedFileName: string = 'Spreadsheet.xls';

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImportCountBatchesComponent>
  ) {}

  ngOnInit(): void {}

  /** Handle row selection logic if needed */
  toggleRowSelection(row: PeriodicElement): void {
    console.log('Row selection toggled:', row);
  }

  /** Confirm the import with dropdown selections */
  confirmImport(): void {
    console.log('Import confirmed with:', {
      selectedImportType: this.selectedImportType,
      selectedFilterBy: this.selectedFilterBy,
    });
    if (this.uploadedFileName) {
      console.log('Uploaded File:', this.uploadedFileName);
    } else {
      console.log('No file uploaded.');
    }
  }

  /** Remove the uploaded file */
  removeFile(): void {
    this.uploadedFileName = '';
    console.log('File removed');
  }

  /** Import selected rows to the queue */
  importToQueue(): void {
    console.log('Data imported to queue:', this.dataSource.data);
  }

  /** Close the dialog */
  close(): void {
    this.dialogRef.close();
  }

  onFilterByChange(): void {
    if (this.selectedFilterBy === 'Item Number') {
      this.openFilterItemNumbersDialog();
    }
  }

  /**
   * Open the Filter Item Numbers Dialog
   */
  openFilterItemNumbersDialog(): void {
    const dialogRef = this.dialog.open(FilterItemNumbersComponent, {
      width: '600px',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Filtered Item Numbers:', result);
        // Handle the filtered data as needed
      }
    });
  }
}
