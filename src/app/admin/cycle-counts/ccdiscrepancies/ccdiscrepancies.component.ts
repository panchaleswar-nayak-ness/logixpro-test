/**
 * Component for managing cycle count discrepancies in a table format.
 * Features:
 * - Table with pagination, sorting, filtering, and context menu.
 * - Actions for importing data, creating transactions, and assigning locations.
 * - Dialog-based confirmations for critical operations.
 */

import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';

import { ImportCountBatchesComponent } from '../import-count-batches/import-count-batches.component';
import { ColumnFilterComponentComponent } from 'src/app/common/globalComponents/column-filter-component/column-filter-component.component';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {
  ToasterType, ToasterTitle, ToasterMessages, DialogConstants, Style,
  ConfirmationMessages, ConfirmationHeadings, StringConditions
} from 'src/app/common/constants/strings.constants';
import { MatTableDataSource } from '@angular/material/table';
import { SelectedDiscrepancy } from '../../../common/interface/admin/ISelectedDiscrepancies';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import {ActionType} from '../../../common/enums/admin/cc-discrepancies-ActionType';  
import {CustomPagination} from '../../../common/types/CommonTypes';
import { AppRoutes } from '../../../common/constants/menu.constants'; 
import { MOCK_DISCREPANCIES } from './ccdiscrepancies-mock-data';
// Enum for supported action types in dropdown


@Component({
  selector: 'app-ccdiscrepancies',
  templateUrl: './ccdiscrepancies.component.html',
  styleUrls: ['./ccdiscrepancies.component.scss']
})
export class CCDiscrepanciesComponent implements OnInit {

  // Table column configuration
  displayedColumns = [
    { colHeader: 'itemNumber', colTitle: 'Item Number', colDef: 'Item Number' },
    { colHeader: 'qtyDifference', colTitle: 'Qty Difference', colDef: 'Qty Difference' },
    { colHeader: 'warehouse', colTitle: 'Warehouse', colDef: 'Warehouse' },
    { colHeader: 'lotNo', colTitle: 'Lot No', colDef: 'Lot No' },
    { colHeader: 'expirationDate', colTitle: 'Expiration Date', colDef: 'Expiration Date' },
    { colHeader: 'serialNo', colTitle: 'Serial No', colDef: 'Serial No' }
  ];

  columnNames = ['itemNumber', 'qtyDifference', 'warehouse', 'lotNo', 'expirationDate', 'serialNo', 'actions'];

  // ViewChild references for Angular Material components
  @ViewChild(MatAutocompleteTrigger) autocompleteInventory!: MatAutocompleteTrigger;
  @ViewChild(ColumnFilterComponentComponent) filterCmp!: ColumnFilterComponentComponent;
  @ViewChild('matRef') matRef!: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table data source and pagination state
  columnValues: string[] = [];
  isActiveTrigger = false;
  dataSource: MatTableDataSource<SelectedDiscrepancy> = new MatTableDataSource<SelectedDiscrepancy>();

customPagination: CustomPagination = {
  total: 0,
  recordsPerPage: 10,
  startIndex: 0,
  endIndex: 0,
};

  params = { page: 1, pageSize: 10, sortColumn: "", sortOrder: "" };

  pageEvent: PageEvent;

  ActionType = ActionType;

  constructor(
    private global: GlobalService,
    private dialog: MatDialog,
    private contextMenuService: TableContextMenuService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * Initializes the table with mock data for testing/demo purposes.
   */
  private initializeTableConfig(): void {
    this.dataSource.data = MOCK_DISCREPANCIES;
    this.customPagination.total = this.dataSource.data.length;
    this.columnValues = [...this.columnNames];
  }

  /**
   * Appends all discrepancy IDs (placeholder for future logic).
   */
  AppendAll(): void {
    const Ids = this.dataSource.data.map(item => item.id);
  }

  /**
   * Adds a single discrepancy to queue (placeholder for API integration).
   */
  AddInQueue(event: SelectedDiscrepancy) {
    const firstColumnKey = Object.keys(event)[0];
    const id = event[firstColumnKey];
    const payload = { id: id };
    this.initializeTableConfig(); // Refresh mock data
  }

  /**
   * Handles page changes from paginator.
   */
  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;
    this.params = { ...this.params, page: e.pageIndex + 1, pageSize: e.pageSize };
    this.customPagination = {
      total: this.customPagination.total,
      recordsPerPage: e.pageSize,
      startIndex: e.pageIndex * e.pageSize + 1,
      endIndex: Math.min((e.pageIndex + 1) * e.pageSize, this.customPagination.total || 0),
    };
  }

  /**
   * Checks whether valid columns exist for display.
   */
  get hasValidColumns(): boolean {
    return !!this.columnValues?.length && !!this.displayedColumns?.length;
  }

  /**
   * Gets the CSS classes for quantity difference styling.
   * @param qtyDifference - The quantity difference value
   * @returns CSS classes string for styling
   */
  getQuantityDifferenceClasses(qtyDifference: number): string {
    const baseClasses = 'label br-14 px-3 f-16';
    return qtyDifference < 0 ? `${baseClasses} label-red` : `${baseClasses} label-green`;
  }

  /**
   * Formats quantity difference for display with proper sign.
   * @param qtyDifference - The quantity difference value
   * @returns Formatted string with sign
   */
  formatQuantityDifference(qtyDifference: number): string {
    return qtyDifference >= 0 ? `+${qtyDifference}` : `${qtyDifference}`;
  }

  /**
   * Handles dropdown action changes and triggers appropriate dialogs or navigations.
   */
 onActionChange(event: MatSelectChange): void {
  const action: ActionType = event.value;

  switch (action) {
    case ActionType.CreateTransaction:
      this.continueCreatingTransactionDialog();
      break;
    case ActionType.AssignLocation:
      this.navigateToLocationAssignment();
      break;
    case ActionType.ImportBatches:
      this.openImportCountBatchesDialog();
      break;
    case ActionType.SetMapping:
      this.importFieldMapping();
      break;
    default:
      this.global.ShowToastr(
        ToasterType.Info,
        ToasterMessages.CountQueueActionTypeError,
        ToasterTitle.Info
      );
      break;
  }

  // Always clear selection after handling
  this.clearMatSelectList();
}


  /**
   * Opens confirmation dialog for continuing a transaction.
   */
  continueCreatingTransactionDialog(): void {
    let dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: ConfirmationMessages.ContinueCreatingTransaction,
        heading: ConfirmationHeadings.ContinueCreatingTransaction,
        message2: ConfirmationMessages.InfoText,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        dialogRef.close(true);
      } else {
        this.openAssignLocationDialog();
      }
    });
  }

  /**
   * Opens confirmation dialog for assigning a location.
   */
  openAssignLocationDialog(): void {
    let dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: ConfirmationMessages.ClickYesToAssignLocation,
        heading: ConfirmationHeadings.AssignLocation,
        customButtonText: true,
        btn1Text: "Yes",
        btn2Text: "No"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === StringConditions.Yes) {
        this.navigateToLocationAssignment();
      } else {
        dialogRef.close(true);
      }
    });
  }

  /**
   * Navigates to the location assignment page.
   */
  navigateToLocationAssignment() {
    this.router.navigate(['admin/locationAssignment']);
  }

  /**
   * Clears selected action from dropdown.
   */
  clearMatSelectList() {
  this.matRef.value = null;  // Reset selection without triggering selectionChange again
}
  /**
   * Opens context menu for table rows with specific filter data.
   */
  onContextMenu(
    event: MouseEvent,
    selectedItem: string | number | boolean | null,
    filterColumnName?: string,
    filterCondition?: string,
    filterItemType?: string
  ): void {
    event.preventDefault();
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(
        event,
        selectedItem,
        filterColumnName,
        filterCondition,
        filterItemType
      );
    }, 100);
  }

  /**
   * Navigates to the audit file field mapping manager screen.
   */
  importFieldMapping(): void {
    this.router.navigate([AppRoutes.AuditFileFieldMappingComponent]);
  }

  /**
   * Opens import count batches dialog.
   */
  openImportCountBatchesDialog(): void {
    const dialogRef = this.dialog.open(ImportCountBatchesComponent, {
      height: 'auto',
      width: '1280px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: { mode: 'addInvMapLocation' }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.matRef.value = null;
    });
  }

  /**
   * Placeholder for sort change logic (for accessibility).
   */
  announceSortChange(e: Sort): void {}

  /**
   * Copies selected text to clipboard on Ctrl+C.
   */
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent): void {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      event.clipboardData?.setData('text/plain', selection);
      event.preventDefault();
    }
  }
}
