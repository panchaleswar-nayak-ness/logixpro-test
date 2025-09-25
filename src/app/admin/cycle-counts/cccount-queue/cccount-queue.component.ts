/**
 * Component for managing the Cycle Count Queue table.
 * Features:
 * - Displays inventory count queue records with pagination and filtering.
 * - Allows removing records from the queue.
 * - Supports importing field mappings and showing a context menu.
 */

import { Component, HostListener, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

import { ColumnFilterComponentComponent } from 'src/app/common/globalComponents/column-filter-component/column-filter-component.component';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterType, ToasterTitle, ToasterMessages, DialogConstants } from 'src/app/common/constants/strings.constants';
import { MatTableDataSource } from '@angular/material/table';
import { SelectedCountQueue } from '../../../common/interface/admin/ISelectedCountQueue';
import {CustomPagination} from '../../../common/types/CommonTypes';
import { take } from 'rxjs/operators'; 
import { CycleCountDataService } from '../cycle-count-data.service';
import { CCDiscrepanciesApiService } from '../../../common/services/ccdiscrepancies/ccdiscrepancies-api.service';
import { CompareLineState } from '../../../common/interface/ccdiscrepancies/CompareLineState';
import { CompareItem } from '../../../common/interface/ccdiscrepancies/CompareItem';
import { CountQueueMapper } from '../../../common/services/ccdiscrepancies/count-queue.mapper';

@Component({
  selector: 'app-cccount-queue',
  templateUrl: './cccount-queue.component.html',
  styleUrls: ['./cccount-queue.component.scss']
})
export class CCCountQueueComponent implements OnInit {

  // Table columns configuration
  displayedColumns = [
    { colHeader: 'itemNumber', colTitle: 'Item Number', colDef: 'Item Number' },
    { colHeader: 'qtyLocation', colTitle: 'Qty Location', colDef: 'Qty Location' },
    { colHeader: 'warehouse', colTitle: 'Warehouse', colDef: 'Warehouse' },
    { colHeader: 'lotNo', colTitle: 'Lot No', colDef: 'Lot No' },
    { colHeader: 'expirationDate', colTitle: 'Expiration Date', colDef: 'Expiration Date' },
    { colHeader: 'serialNo', colTitle: 'Serial No,', colDef: 'Serial No.' }
  ];

  columnNames = ['itemNumber', 'qtyLocation', 'warehouse', 'lotNo', 'expirationDate', 'serialNo', 'actions'];

  // ViewChild references for Angular Material components
  @ViewChild(MatAutocompleteTrigger) autocompleteInventory!: MatAutocompleteTrigger;
  @ViewChild(ColumnFilterComponentComponent) filterCmp!: ColumnFilterComponentComponent;
  @ViewChild('matRef') matRef!: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Component state
  columnValues: string[] = [];
  isActiveTrigger = false;
  dataSource: MatTableDataSource<SelectedCountQueue> = new MatTableDataSource<SelectedCountQueue>();
  customPagination: CustomPagination = {
  total: 0,
  recordsPerPage: 10,
  startIndex: 0,
  endIndex: 0,
};
  params = { page: 1, pageSize: 10, sortColumn: "", sortOrder: "" };
  pageEvent: PageEvent;
  TotalLocation: number = 0;

  constructor(
    private global: GlobalService,
    private dialog: MatDialog,
    private contextMenuService: TableContextMenuService,
    private router: Router,
    private ngZone: NgZone,
    private cycleCountDataService: CycleCountDataService,
    private ccDiscrepanciesApiService: CCDiscrepanciesApiService,
    private countQueueMapper: CountQueueMapper
  ) {}

  ngOnInit() {
    this.initializeTableConfig();
    this.loadData(); // Load initial data from API
    
    // Subscribe to count queue updates
    this.cycleCountDataService.countQueue$.subscribe(data => {
      this.dataSource.data = data;
      this.customPagination.total = this.dataSource.data.length;
      this.TotalLocation = this.dataSource.data.reduce((sum, item) => sum + item.qtyLocation, 0);
    });
  }

  private async loadData(): Promise<void> {
    const pagingRequest = {
      page: this.params.page,
      pageSize: this.params.pageSize,
      sortColumn: this.params.sortColumn,
      sortOrder: this.params.sortOrder
    };

    try {
      const response = await this.ccDiscrepanciesApiService.getCountQueue(pagingRequest);
      if (!response) {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.APIErrorMessage,
          ToasterTitle.Error
        );
        return;
      }

      if (response.isSuccess && response.value) {
        const countQueueDtos: CompareItem[] = response.value;
        const countQueue: SelectedCountQueue[] = this.countQueueMapper.mapToSelectedCountQueueArray(countQueueDtos);
        
        this.cycleCountDataService.updateCountQueue(countQueue);
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
   * Initializes table with mock data (for demonstration/testing).
   * Also calculates the total quantity across locations.
   */
  private initializeTableConfig(): void {
    this.columnValues = [...this.columnNames];
    this.cycleCountDataService.updateCountQueue([]);
  }

  /**
   * Removes all records from the queue (placeholder for future logic).
   */
  /**
   * Removes all records from the queue and moves them back to discrepancies.
   */
  async RemoveAll(): Promise<void> {
    if (this.dataSource.data.length === 0) {
      this.global.ShowToastr(ToasterType.Info, ToasterMessages.NoRecordFound, ToasterTitle.Info);
      return;
    }

    try {
      const ids = this.dataSource.data.map(item => item.id);
      const result = await this.ccDiscrepanciesApiService.changeCompareItemsState(ids, CompareLineState.Processed);
      if (result.isSuccess) {
        this.cycleCountDataService.moveAllBackToDiscrepancies();
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.DeleteAllSuccess, ToasterTitle.Success);
        this.initializeTableConfig();
      } else {
        this.global.ShowToastr(ToasterType.Error, result.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }

  /**
   * Removes a specific record from the queue and moves it back to discrepancies.
   * @param event Selected count queue item.
   */
  async RemoveFromQueue(event: SelectedCountQueue): Promise<void> {
    if (!event.id) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      return;
    }

    try {
      const result = await this.ccDiscrepanciesApiService.changeCompareItemsState([event.id], CompareLineState.Processed);
      if (result.isSuccess) {
        this.cycleCountDataService.moveBackToDiscrepancies(event);
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.RemoveFromQueueSuccess, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, result.errorMessage || ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }

  /**
   * Handles paginator events and updates page parameters.
   * @param e Page event emitted by paginator.
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
   * Checks whether valid columns exist for the table.
   */
  get hasValidColumns(): boolean {
    return !!this.columnValues?.length && !!this.displayedColumns?.length;
  }

  /**
   * Opens context menu on right-click over table rows.
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
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.contextMenuService.updateContextMenuState(
        event,
        selectedItem,
        filterColumnName,
        filterCondition,
        filterItemType
      );
    });
  }

  /**
   * Navigates to the audit file field mapping manager screen.
   */
  importFieldMapping(): void {
    this.router.navigate(['/admin/auditFileFieldMapping']);
  }

  /**
   * Placeholder for sorting logic on column sort events.
   */
  announceSortChange(e: Sort): void {}

  /**
   * Handles Ctrl+C copy events, copying selected text from the table.
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
