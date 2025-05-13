import { Component, OnInit,OnDestroy , ViewChild,SimpleChanges, ChangeDetectorRef,Input } from '@angular/core';
import { Pipe } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { Sort,MatSort  } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IConHeaderResponse } from '../routeid-header/Irouteid-list';
import { IQueryParams } from '../routeid-list/routeid-IQueryParams';

import { AuthService } from '../../../common/init/auth.service';
import { ConfirmationDialogComponent } from '../../../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { RouteManagementDetailViewComponent } from '../../../admin/dialogs/route-management-detail-view/route-management-detail-view.component';
import { RouteHistoryService } from 'src/app/common/services/route-history.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from '../../../admin/inventory-master/current-tab-data-service';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import {ColumnFilterComponentComponent  } from 'src/app/common/globalComponents/column-filter-component/column-filter-component.component';


import { DialogConstants, StringConditions, ColumnDef, UniqueConstants, ToasterMessages, ToasterTitle, ToasterType, Placeholders } from 'src/app/common/constants/strings.constants';
import { AppRoutes } from 'src/app/common/constants/menu.constants';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';

type RouteIDItem = {
  RouteID: string;
  StatusDate: string;
  rawStatusDate: string;
  ConsolidationStatus: string;
  RouteIDStatus: string;
  ConsolidationProgress: string;
  showRequestReleaseButton?: boolean;
};

@Component({
  selector: 'app-routeid-list',
  templateUrl: './routeid-list.component.html',
  styleUrls: ['./routeid-list.component.scss']
  
})
export class RouteidListComponent implements OnInit,OnDestroy { 
  intervalId: number | null = null;
isAutoRefreshEnabled: boolean = true;
isAutoRefreshActive: boolean = false;
sortColumnName:string;
sortColumnvalue:string;
@Input() selectedZone: string;
zone:string;
 paginationParams: { page: number; pageSize: number };
 SearchingParams:{Column:string;Value:string};
 RouteIDListData: {
    RouteID: string;
    StatusDate: string;
    rawStatusDate: string;
    ConsolidationStatus: string;
    RouteIDStatus: string;
    ConsolidationProgress: string;
  }[] = [];
  companyObj = { storageContainer: false };
    placeholders = Placeholders;
    fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
    HeadingRouteIDList: string  = this.fieldMappings['con.HeaderList'];
    HeadingRouteID: string  = this.fieldMappings.routeId;
    statusDate: string  = this.fieldMappings.statusDate;
    consolidationStatus: string  = this.fieldMappings.consolidationStatus;
    routeIDStatus: string  = this.fieldMappings.routeIdStatus;
    consolidationProgress: string  = this.fieldMappings.consolidationProgress;
    RouteIDListColumn = [
      { colHeader: "RouteID", colDef: this.HeadingRouteID, colTitle: this.HeadingRouteID },
      { colHeader: "StatusDate", colDef: this.statusDate, colTitle: "Status Date" },
      { colHeader: "ConsolidationStatus", colDef: this.consolidationStatus, colTitle: "Consolidation Status" },
      { colHeader: "RouteIDStatus", colDef: this.routeIDStatus, colTitle: "Route ID Status" },
      { colHeader: "ConsolidationProgress", colDef: this.consolidationProgress, colTitle: "Consolidation Progress" },
    ];

    columnNames: string[] = [
      "RouteID",
      "StatusDate",
      "ConsolidationStatus",
      "RouteIDStatus",
      "ConsolidationProgress"
    ];

    isActiveTrigger:boolean=false;
    onDestroy$: Subject<boolean> = new Subject();
    hideRequiredControl = new FormControl(false);
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    setStorage;
    fieldNames:string;
    isClearWholeLocationAvailable: boolean = false;
    // Define column names as an array of strings (Correct Type)
    displayedColumns: { colHeader: string, colDef: string, colTitle: string }[] = [];
    public dataSource: MatTableDataSource<{ RouteID: string;
      StatusDate: string;
      rawStatusDate: string;
      ConsolidationStatus: string;
      RouteIDStatus: string;
      ConsolidationProgress: string}>
    
      customPagination: { total: string, recordsPerPage: number, startIndex: number, endIndex: number } = {
        total: '',
        recordsPerPage: 10,
        startIndex: 0,
        endIndex: 0
      }
   
      columnSearch: { searchColumn: { colHeader: string, colDef: string }, searchValue: string } = {
        searchColumn: { colHeader: '', colDef: '' },
        searchValue: ''
      };
    
      sortColumn: { columnName: string; sortOrder: string } = {
        columnName: '',
        sortOrder: UniqueConstants.Asc
      };

    searchAutocompleteList: [];
    public iConsolidationApi: IConsolidationApi;
    public columnValues: string[] = [];
    public isSearchColumn:boolean = false;
  
    detailData: RouteIDItem;
    transHistory:boolean = false;
    clickTimeout:ReturnType<typeof setTimeout>;
  
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('matRef') matRef: MatSelect;
    @ViewChild(MatAutocompleteTrigger) autocompleteInventory: MatAutocompleteTrigger;
    @ViewChild(ColumnFilterComponentComponent) filterCmp: ColumnFilterComponentComponent;

   //---------------------for mat menu End ----------------------------
   previousUrl: string;
    constructor(
      private global:GlobalService,
      private authService: AuthService,
      public consolidationApiService: ConsolidationApiService,
      private dialog:MatDialog,
      private router: Router,
      private routeHistoryService: RouteHistoryService,
      private currentTabDataService: CurrentTabDataService,
      private contextMenuService : TableContextMenuService,
      private _liveAnnouncer: LiveAnnouncer,
      private cdr: ChangeDetectorRef
    ) {
      this.previousUrl = this.routeHistoryService.getPreviousUrl();
      this.iConsolidationApi = consolidationApiService;
      
      if(this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue] ){
        this.columnSearch.searchValue = this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue] ;
        this.columnSearch.searchColumn = {
          colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
          colHeader: this.router.getCurrentNavigation()?.extras?.state?.['colHeader']
        }
        this.isSearchColumn = true;
      }
      else if (this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP])
        {
            
            this.isSearchColumn = true;
        }
      if(router.url == AppRoutes.OrderManagerInventoryMap){
        this.transHistory = true;
      }
      else if(router.url ==AppRoutes.AdminInventoryMap  || AppRoutes.InductionManagerAdminInventoryMap){
        this.transHistory = false;
      }
  
    }

    transform(value: string | Date): string | null {
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return null;
  }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['selectedZone'] && changes['selectedZone'].currentValue) {
        this.zone = changes['selectedZone'].currentValue;
        this.fetchConsolidationTableData(this.zone);
        this.startAutoRefresh();
      }
    }
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
      this.customPagination = {
        total : '',
        recordsPerPage : 10,
        startIndex: 0,
        endIndex: 10
      };
    
      this.fetchConsolidationTableData(this.zone);
      this.getColumnsData();
    
      this.dataSource.filterPredicate = (data: RouteIDItem, filter: string) => {
        const searchTerms = JSON.parse(filter);
        const columnValue = data[searchTerms.column] ? data[searchTerms.column].toString().toLowerCase() : '';
        return columnValue.includes(searchTerms.value.toLowerCase());
      };
    
    }
    

    getConsolidationStatusClass(col: { colHeader: string; colDef: string }, element: RouteIDItem): string {
      if (col.colDef === 'Consolidation Status') {
        switch (element[col.colHeader]) {
          case 'Initialized':
            return 'br-14 label px-3 f-16 label-blue2';
          case 'Induction Started':
            return 'br-14 label px-3 f-16 label-yellow';
          case 'Con Completed':
            return 'br-14 label px-3 f-16 label-green';
            case 'Con. Completed':
            return 'br-14 label px-3 f-16 label-green';
            case 'Con. Complete':
            return 'br-14 label px-3 f-16 label-green';
            case 'Complete':
            return 'br-14 label px-3 f-16 label-green';
          default:
            return '';
        }
      }
      return '';
    }
    
    lastindex: number = 0; // Class-level property

    pageEvent: PageEvent;
  
    handlePageEvent(e: PageEvent): void {
      this.pageEvent = e;
    
      // Calculate 1-based page number for API
      this.paginationParams = {
        page: e.pageIndex + 1,
        pageSize: e.pageSize
      };
    
      // Optional: Track visible record range (for UI display)
      this.customPagination = {
        total: this.customPagination.total,  // keep total as-is
        recordsPerPage: e.pageSize,
        startIndex: e.pageIndex * e.pageSize + 1,
        endIndex: Math.min((e.pageIndex + 1) * e.pageSize, parseInt(this.customPagination.total || '0'))
      };
    
      this.fetchConsolidationTableData(this.zone);
    }
    
  
   getColumnsData() {
      this.displayedColumns = this.RouteIDListColumn;
      this.columnValues = this.columnNames;
      this.columnValues.push(ColumnDef.Actions);
      this.getContentData();
    }
   
    
    getContentData(){
      
      const currentFilter = this.dataSource.filter;

      this.dataSource.data = this.RouteIDListData;
      this.customPagination.total = this.RouteIDListData.length.toString();
      this.dataSource.sort = this.sort;
      this.customPagination.total = this.RouteIDListData.length.toString();
      
      if (currentFilter) {
        this.dataSource.filter = currentFilter;
      }

    }
   
    applyFilter(filterValue:string, colHeader:string) {
      //need to test this
      this.dataSource.filter = "";
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
  
    edit(event: RouteIDItem){
   
      let dialogRef:any = this.global.OpenDialog(RouteManagementDetailViewComponent, {
        height: DialogConstants.auto,
        width: '640px',
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          detailData : event,
          fieldName:this.fieldNames
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
          this.getContentData();
        this.fetchConsolidationTableData(this.zone)
      })

    
    }
  

    RequestRelease(event: RouteIDItem) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '560px',
        data: {
          heading: '',
          message: 'Are you sure you want to Request Release',
          customButtonText: true,
          btn1Text: 'Yes',
          btn2Text: 'No'
        }
      });
    
      dialogRef.afterClosed().subscribe(async (resp) => {
        if (resp == "Yes") {
          // Get the first column dynamically
          const firstColumnKey = Object.keys(event)[0]; // Get the first column name
          const conHeaderID = event[firstColumnKey];    // Get its value
    
          const payload = {
            ConHeaderID: conHeaderID,
            ReleaseStatus: { Key: "Release Requested" }
          };
    

          try {
            const response = await this.consolidationApiService.ConHeadersRequestRelease(conHeaderID);
          
            if (response.status === 200) {
              this.global.ShowToastr(ToasterType.Success, ToasterMessages.RequestReleaseSuccess, ToasterTitle.Success);
            } 
          } catch (error) {
            this.global.ShowToastr(ToasterType.Error, ToasterMessages.RequestReleaseFailed, ToasterTitle.Error);
          }
          
        }
    
        this.getContentData(); // Refresh data in both cases
      });
    }
    

  
    autoCompleteSearchColumn(){
      
    }
  
    searchColumn(){ 
      this.isAutoRefreshEnabled = false;
      this.stopAutoRefresh();
     if (this.columnSearch.searchColumn && this.columnSearch.searchColumn.colDef === '') {
  // Corrected comparison: compare the colDef string
  this.isSearchColumn = false;
  this.getContentData();
} else {
  this.isSearchColumn = true;
}
      
      this.searchAutocompleteList = [];
      if(this.columnSearch.searchValue){
        this.columnSearch.searchValue = '';
         this.getContentData();
      }
    }
    closeAutoMenu()
    {
      this.autocompleteInventory.closePanel(); 
    }

    searchData() {
      this.isAutoRefreshEnabled = false;
      this.stopAutoRefresh();
    
      if (this.columnSearch.searchColumn?.colDef && this.columnSearch.searchValue) {
        const columnMap: { [key: string]: string } = {
          'Status Date': 'StatusDate',
          [this.HeadingRouteID]: 'RouteID',
          'Consolidation Status': 'ConsolidationStatus',
          'Route ID Status': 'RouteIDStatus',
          'Consolidation Progress': 'ConsolidationProgress'
        };
    
        const columnKey = columnMap[this.columnSearch.searchColumn.colDef];
        if (!columnKey) {
          return;
        }
    
        let searchValue = this.columnSearch.searchValue.trim();
    
        if (columnKey === 'StatusDate') {
          const formatted = this.global.formatDateToYyyyMmDd(searchValue);
          if (formatted) {
            searchValue = formatted;
          } else {
            console.warn("Invalid date input for Status Date filter");
            return;
          }
        }
    
        this.resetPagination(); // Ensures pageIndex = 0
    
        const filterObject = {
          column: columnKey,
          value: searchValue
        };
    
        this.fetchConsolidationTableData(this.zone, filterObject, {
          column: this.columnValues[this.sortColumn.columnName],
          order: this.sortColumn.sortOrder as 'asc' | 'desc' | ''
        });
      }
    }
    
    

onSelectionChange(selectedValue: string): void {
  if (selectedValue) {
    this.columnSearch.searchColumn.colDef = selectedValue;
    this.searchColumn();
  }
}
   reset() {
    this.resetPagination();
    this.columnSearch.searchValue = '';
    this.columnSearch.searchColumn = { colHeader: '', colDef: '' };
    this.dataSource.filter = '';
      
    // Immediately fetch unfiltered data
    this.fetchConsolidationTableData(this.zone);
      
    // Restart auto-refresh
    this.startAutoRefresh();
      }
      
      onContextMenu(
        event: MouseEvent,
        SelectedItem: string | number | boolean | null | undefined,
        FilterColumnName?: string,
        FilterConditon?: string,
        FilterItemType?: string
      ): void {
        event.preventDefault();
        this.isActiveTrigger = true;
        setTimeout(() => {
          this.contextMenuService.updateContextMenuState(
            event,
            SelectedItem,
            FilterColumnName,
            FilterConditon,
            FilterItemType
          );
        }, 100);
      }
      
  
    filterString : string = UniqueConstants.OneEqualsOne;
  
    optionSelected(filter : string) {
      this.filterString = filter;
      this.getContentData();    
      this.isActiveTrigger = false;
    }

    announceSortChange(e: Sort) {
      const column = e.active;
      const order = e.direction;
      this.sortColumnName=e.active;
      this.sortColumnvalue=e.direction;
      
      this.sortColumn = {
        columnName: column,
        sortOrder: order
      };
    
      this.resetPagination();
    
      const search =
        this.columnSearch?.searchColumn?.colDef && this.columnSearch?.searchValue
          ? {
              column: this.columnSearch.searchColumn.colDef,
              value: this.columnSearch.searchValue
            }
          : undefined;
    
      this.fetchConsolidationTableData(this.zone, search, { column, order });
    }
    
    getFloatLabelValue(): FloatLabelType {
      return this.floatLabelControl.value ?? 'auto';
    }
  
  get hasValidColumns(): boolean {
    return !!this.columnValues?.length && !!this.displayedColumns?.length;
  }
  
  resetPagination(){
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 10;
    this.paginator.pageIndex = 0;
  }

  async fetchConsolidationTableData(
    selectedZone: string,
    SearchItem?: { column: string; value: string },
    SortItem?: { column: string; order: string }
  ) {
    try {
      if (!this.paginationParams) {
        this.paginationParams = { page: 1, pageSize: 10 };
      }
  
      const params: {
        page: number;
        pageSize: number;
        searchColumn?: string;
        searchValue?: string;
        sortColumn?: string;
        sortOrder?: string;
      } = {
        page: this.paginationParams.page,
        pageSize: this.paginationParams.pageSize
      };
  
      if (SearchItem?.column && SearchItem?.value) {
        params.page = 1;
        params.searchColumn = SearchItem.column;
        params.searchValue = SearchItem.value;
        this.resetPagination();
      }
  
      if (SortItem?.column && SortItem?.order) {
        params.page = 1;
        params.sortColumn = SortItem.column;
        params.sortOrder = SortItem.order;
      }
  
      const response = await this.iConsolidationApi.GetSelectedConZoneConHeadersData(selectedZone, params);
      const fullItems = response?.body;
      const paginationHeader = response.headers.get('X-Pagination');
      const pagination = JSON.parse(paginationHeader);
      this.customPagination.total = pagination.TotalCount.toString();
  
      if (Array.isArray(fullItems)) {
        const resources = fullItems.map(x => x.resource);
        this.processConsolidationData(resources);
      }
    } catch {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConheaderData, ToasterTitle.Error);
    }
  }
  
  
  
    // Format and emit route ID list data
    processConsolidationData(data: IConHeaderResponse['resource'][]): void {
      const newData = data.map((item) => ({
        RouteID: item.routeID,
        StatusDate: item.statusDate ? new Date(item.statusDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        rawStatusDate: item.statusDate,
        ConsolidationStatus: item.consolidationStatus ?? '',
        RouteIDStatus: item.routeIdStatus ?? '',
        ConsolidationProgress: item.consolidationProgress ?? '-'
      }));
  
      let dataChanged = !Array.isArray(this.RouteIDListData) || JSON.stringify(this.RouteIDListData) !== JSON.stringify(newData);
      this.RouteIDListData = newData;

      const previousColumn = this.columnSearch.searchColumn?.colDef;
      const previousValue = this.columnSearch.searchValue;
  
      // Add the conditional property directly in the dataSource
      this.RouteIDListData.forEach((item: RouteIDItem) => {
        item.showRequestReleaseButton = item.RouteIDStatus === 'In Consolidation';
      });
  
      // Refresh the dataSource with new data
      this.dataSource = new MatTableDataSource(this.RouteIDListData);
      
      // Set custom filter predicate for column-based filtering
      this.dataSource.filterPredicate = (data: RouteIDItem, filter: string) => {
        const filterObj = JSON.parse(filter); // Convert filter string back to object
        const columnValue = data[filterObj.column]?.toString().toLowerCase() || '';
        return columnValue.includes(filterObj.value.toLowerCase());
      };
  
      // Reapply pagination and sorting
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      
      // Reapply filter if it was set before
    // Keep current search state without triggering another fetch
    this.columnSearch.searchColumn.colDef = previousColumn;
    this.columnSearch.searchValue = previousValue;
  
      // Mark for check to trigger change detection
      this.cdr.markForCheck();

    }

    startAutoRefresh(): void {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
  
      // Explicitly cast the return value of setInterval to `number` for compatibility
      this.intervalId = setInterval(() => {
        let search: { column: string; value: string } | undefined;
  
        if (this.columnSearch.searchColumn?.colDef && this.columnSearch.searchValue) {
          const columnMap: { [key: string]: string } = {
            'Status Date': 'StatusDate',
            [this.HeadingRouteID]: 'RouteID',
            'Consolidation Status': 'ConsolidationStatus',
            'Route ID Status': 'RouteIDStatus',
            'Consolidation Progress': 'ConsolidationProgress'
          };
  
          const columnKey = columnMap[this.columnSearch.searchColumn.colDef];
          if (columnKey) {
            search = {
              column: columnKey,
              value: this.columnSearch.searchValue.trim()
            };
          }
        }
  
        this.fetchConsolidationTableData(this.zone, search, {
          column: this.sortColumnName ?? null,
          order: this.sortColumnvalue ?? null
        });
      }, 5000) as unknown as number; // Casting to `number`
    }
  
    stopAutoRefresh(): void {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  
    onClearFilter() {
      this.columnSearch.searchColumn.colDef = '';
      this.columnSearch.searchValue = '';
      this.reset();
    
      this.isAutoRefreshEnabled = true;
      this.startAutoRefresh();
    }
    
    ngOnDestroy(): void {
      this.onDestroy$.next(true);
      this.onDestroy$.complete();
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }
  