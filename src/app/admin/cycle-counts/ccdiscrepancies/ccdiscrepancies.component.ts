/**
 * Component for managing cycle count discrepancies in a table format.
 * Features:
 * - Table with pagination, sorting, filtering, and context menu.
 * - Actions for importing data, creating transactions, and assigning locations.
 * - Dialog-based confirmations for critical operations.
 */

import { Component, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../common/init/auth.service';

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
import { ActionType } from '../../../common/enums/admin/cc-discrepancies-ActionType';  
import { CustomPagination } from '../../../common/types/CommonTypes';
import { AppRoutes } from '../../../common/constants/menu.constants'; 
import { CycleCountDataService } from '../cycle-count-data.service';
import { CompareItem } from '../../../common/interface/ccdiscrepancies/CompareItem';
import { CCDiscrepanciesApiService } from '../../../common/services/ccdiscrepancies/ccdiscrepancies-api.service';
import { CompareLineState } from '../../../common/interface/ccdiscrepancies/CompareLineState';
import { SelectedCountQueue } from '../../../common/interface/ccdiscrepancies/SelectedCountQueue';
import { UserSession } from '../../../common/types/CommonTypes';
import { CycleCountTransactionRequest } from '../../../common/interface/ccdiscrepancies/CycleCountTransactionRequest';

// Enum for supported action types in dropdown


@Component({
  selector: 'app-ccdiscrepancies',
  templateUrl: './ccdiscrepancies.component.html',
  styleUrls: ['./ccdiscrepancies.component.scss']
})
export class CCDiscrepanciesComponent implements OnInit, OnDestroy {

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
  hasCountQueueData = false;
  private destroy$ = new Subject<void>();

  constructor(
    private global: GlobalService,
    private dialog: MatDialog,
    private contextMenuService: TableContextMenuService,
    private router: Router,
    private cycleCountDataService: CycleCountDataService,
    private ccDiscrepanciesApiService: CCDiscrepanciesApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeTableConfig();
    this.loadData(); // Load initial data from API
    
    // Subscribe to discrepancies updates
    this.cycleCountDataService.discrepancies$
      .pipe(takeUntil(this.destroy$))
      .subscribe(discrepancies => {
        this.dataSource.data = discrepancies;
        this.customPagination.total = discrepancies.length;
      });

    // Subscribe to count queue updates to enable/disable Create Transaction option
    this.cycleCountDataService.countQueue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(countQueue => {
        this.hasCountQueueData = countQueue.length > 0;
      });
  }

  /**
   * Initializes the table with mock data for testing/demo purposes.
   */
  private initializeTableConfig(): void {
    this.columnValues = [...this.columnNames];
  }

  private async loadData(): Promise<void> {
    const pagingRequest = {
      page: this.params.page,
      pageSize: this.params.pageSize,
      sortColumn: this.params.sortColumn,
      sortOrder: this.params.sortOrder
    };

    try {
      const response = await this.cycleCountDataService.getComparedInventoryItems(pagingRequest);
      if (!response) {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.APIErrorMessage,
          ToasterTitle.Error
        );
        return;
      }

      if (response.isSuccess && response.value) {
        const discrepancies: SelectedDiscrepancy[] = response.value.map(item => ({
          id: item.id,
          itemNumber: item.itemNumber,
          qtyDifference: item.quantityDifference,
          warehouse: item.warehouse,
          lotNo: item.lotNumber,
          expirationDate: item.expirationDate,
          serialNo: item.serialNumber
        }));
        
        this.dataSource.data = discrepancies;
        this.customPagination.total = discrepancies.length;
        this.cycleCountDataService.updateDiscrepancies(discrepancies);
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          response.errorMessage || ToasterMessages.APIErrorMessage,
          ToasterTitle.Error
        );
      }
    } catch (error) {
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.APIErrorMessage,
        ToasterTitle.Error
      );
    }
  }

  /**
   * Appends all discrepancy IDs (placeholder for future logic).
   */
  async AppendAll(): Promise<void> {
    const ids = this.dataSource.data.map(item => item.id);
    if (ids.length === 0) {
      this.global.ShowToastr(ToasterType.Info, ToasterMessages.NoRecordFound, ToasterTitle.Info);
      return;
    }

    try {
      const result = await this.ccDiscrepanciesApiService.changeCompareItemsState(ids, CompareLineState.Released);
      if (result.isSuccess) {
        this.cycleCountDataService.moveAllToQueue();
        this.dataSource.data = [];
        this.customPagination.total = 0;
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.AddToQueueSuccess, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, result.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }

  /**
   * Adds a single discrepancy to queue (placeholder for API integration).
   */
  async AddInQueue(event: SelectedDiscrepancy): Promise<void> {
    if (!event.id) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      return;
    }

    try {
      const result = await this.ccDiscrepanciesApiService.changeCompareItemsState([event.id], CompareLineState.Released);
      if (result.isSuccess) {
        this.cycleCountDataService.moveToQueue(event);
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== event.id);
        this.customPagination.total = this.dataSource.data.length;
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.AddToQueueSuccess, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, result.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
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
    this.loadData();
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
    case ActionType.ImportDiscrepancies:
      this.router.navigate(['admin/cycleCount']);
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
  async continueCreatingTransactionDialog(): Promise<void> {
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

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'Yes') {
        await this.processTransactionCreation();
      } else {
        this.openAssignLocationDialog();
      }
    });
  }

  /**
   * Processes the transaction creation workflow.
   */
  private async processTransactionCreation(): Promise<void> {
    try {
      this.cycleCountDataService.countQueue$.pipe(take(1)).subscribe(async queueData => {
        if (!this.validateQueueData(queueData)) {
          return;
        }

        const stateChangeSuccess = await this.changeItemsStateToSubmitted(queueData);
        if (!stateChangeSuccess) {
          return;
        }

        const transactionCreationSuccess = await this.createTransactionsForItems(queueData);
        if (!transactionCreationSuccess) {
          return;
        }

        this.handleTransactionCreationSuccess();
      });
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }

  /**
   * Validates the queue data.
   */
  private validateQueueData(queueData: SelectedCountQueue[] | null | undefined): boolean {
    if (!queueData || !Array.isArray(queueData) || queueData.length === 0) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.NoRecordFound, ToasterTitle.Error);
      return false;
    }
    return true;
  }

  /**
   * Changes the state of all items to Submitted.
   */
  private async changeItemsStateToSubmitted(queueData: SelectedCountQueue[]): Promise<boolean> {
    const ids = queueData.map(item => item.id);
    const stateResult = await this.ccDiscrepanciesApiService.changeCompareItemsState(ids, CompareLineState.Submitted);
    
    if (!stateResult.isSuccess) {
      this.global.ShowToastr(ToasterType.Error, stateResult.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      return false;
    }
    
    return true;
  }

  /**
   * Creates transactions for all items in the queue.
   */
  private async createTransactionsForItems(queueData: SelectedCountQueue[]): Promise<boolean> {
    const userData = this.authService.userData() as UserSession;
    
    for (const item of queueData) {
      const request = this.buildTransactionRequest(item, userData);
      const transactionResult = await this.ccDiscrepanciesApiService.createCycleCountTransaction(request);
      
      if (!transactionResult.isSuccess) {
        this.global.ShowToastr(ToasterType.Error, transactionResult.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Builds the transaction request object for a single item.
   */
  private buildTransactionRequest(item: SelectedCountQueue, userData: UserSession): CycleCountTransactionRequest {
    return {
      userName: userData.userName,
      itemNumber: item.itemNumber,
      serialNumber: item.serialNo || '',
      lotNumber: item.lotNo || '',
      expirationDate: item.expirationDate ? new Date(item.expirationDate) : undefined,
      hostQuantity: item.qtyLocation
    };
  }

  /**
   * Handles the success scenario after transaction creation.
   */
  private handleTransactionCreationSuccess(): void {
    this.global.ShowToastr(ToasterType.Success, ToasterMessages.TransactionCreatedSuccess, ToasterTitle.Success);
    this.cycleCountDataService.updateCountQueue([]);
    this.openAssignLocationDialog();
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
  announceSortChange(e: Sort): void {
    this.params = {
      ...this.params,
      sortColumn: e.active,
      sortOrder: e.direction
    };
    this.loadData();
  }

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
  async removeAll(): Promise<void> {
    const ids = this.dataSource.data.map(item => item.id);
    if (ids.length === 0) {
      this.global.ShowToastr(ToasterType.Info, ToasterMessages.NoRecordFound, ToasterTitle.Info);
      return;
    }

    try {
      const result = await this.ccDiscrepanciesApiService.deleteComparedItems(ids);
      if (result.isSuccess && result.value?.success) {
        // Clear the data source and update the service
        this.dataSource.data = [];
        this.customPagination.total = 0;
        this.cycleCountDataService.updateDiscrepancies([]);
        
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.DeleteAllSuccess, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, result.value?.message || result.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
