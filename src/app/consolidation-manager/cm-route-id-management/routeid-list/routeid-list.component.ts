import { Component, OnInit, ViewChild, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { AuthService } from '../../../common/init/auth.service';
import { ConfirmationDialogComponent } from '../../../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { RouteManagementDetailViewComponent } from '../../../admin/dialogs/route-management-detail-view/route-management-detail-view.component';
import { RouteHistoryService } from 'src/app/common/services/route-history.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from '../../../admin/inventory-master/current-tab-data-service';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';

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
export class RouteidListComponent implements OnInit {
 
  @Input() RouteIDListData: {
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
    HeadingRouteIDList: string  = this.fieldMappings.routeidheading;
    HeadingRouteID: string  = this.fieldMappings.routeID;
    statusDate: string  = this.fieldMappings.statusDate;
    consolidationStatus: string  = this.fieldMappings.consolidationStatus;
    routeIDStatus: string  = this.fieldMappings.routeIDStatus;
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
        recordsPerPage: 20,
        startIndex: 0,
        endIndex: 0
      }
   
      columnSearch: { searchColumn: { colHeader: string, colDef: string }, searchValue: string } = {
        searchColumn: { colHeader: '', colDef: '' },
        searchValue: ''
      };
    
      sortColumn: { columnName: number, sortOrder: string } = {
        columnName: 0,
        sortOrder: UniqueConstants.Asc
      };

    payload: any;
  
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
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
      //this.filterService.filterString = "";
      this.customPagination = {
        total : '',
        recordsPerPage : 20,
        startIndex: 0,
        endIndex: 20
      }
  
      this.getColumnsData();
      
      
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchTerms = JSON.parse(filter);
        const columnValue = data[searchTerms.column] ? data[searchTerms.column].toString().toLowerCase() : '';
        return columnValue.includes(searchTerms.value.toLowerCase());
      };

    }

  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['RouteIDListData'] && changes['RouteIDListData'].currentValue) {
        // Store existing filter values before updating dataSource
        const previousColumn = this.columnSearch.searchColumn?.colDef;
        const previousValue = this.columnSearch.searchValue;
    
        // Add the conditional property directly in the dataSource
        this.RouteIDListData.forEach((item: any) => {
          item.showRequestReleaseButton = item.RouteIDStatus === 'In Consolidation';
        });
    
        // Refresh the dataSource with new data
        this.dataSource = new MatTableDataSource(this.RouteIDListData);
        
        // Set custom filter predicate for column-based filtering
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const filterObj = JSON.parse(filter); // Convert filter string back to object
          const columnValue = data[filterObj.column]?.toString().toLowerCase() || '';
          return columnValue.includes(filterObj.value.toLowerCase());
        };
    
        // Reapply pagination and sorting
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
    
        // Reapply filter if it was set before
        if (previousColumn && previousValue) {
          this.columnSearch.searchColumn.colDef = previousColumn;
          this.columnSearch.searchValue = previousValue;
          this.searchData();
        }
    
        // Mark for check to trigger change detection
        this.cdr.markForCheck();
      }
    }
    
    

    getConsolidationStatusClass(col: { colHeader: string; colDef: string }, element: RouteIDItem): string {
      if (col.colDef === 'Consolidation Status') {
        switch (element[col.colHeader]) {
          case 'Initialized':
            return 'br-14 label px-3 f-16 label-yellow';
          case 'Induction Started':
            return 'br-14 label px-3 f-16 label-blue2';
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
    
 
    pageEvent: PageEvent;
  
    handlePageEvent(e: PageEvent) {
      this.pageEvent = e;
  
      this.customPagination.startIndex =  e.pageSize*e.pageIndex
  
      this.customPagination.endIndex =  (e.pageSize*e.pageIndex + e.pageSize)
      this.customPagination.recordsPerPage = e.pageSize;
  
     this.dataSource.sort = this.sort;
  
     this.getContentData()
     
    }
  
   getColumnsData() {
      this.displayedColumns = this.RouteIDListColumn;
      this.columnValues = this.columnNames;
      this.columnValues.push(ColumnDef.Actions);
      this.getContentData();
    }
   
    
    getContentData(){
      
      const currentFilter = this.dataSource.filter;

      this.dataSource = new MatTableDataSource(this.RouteIDListData);
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
              console.log("Release request successful");
            } else {
              this.global.ShowToastr(ToasterType.Error, ToasterMessages.Consolidationstatuscount, ToasterTitle.Error);
            }
          } catch (error) {
            this.global.ShowToastr(ToasterType.Error, ToasterMessages.Consolidationstatuscount, ToasterTitle.Error);
          }
          
        }
    
        this.getContentData(); // Refresh data in both cases
      });
    }
    

  
    autoCompleteSearchColumn(){
    }
  
    searchColumn(){ 
     if (this.columnSearch.searchColumn && this.columnSearch.searchColumn.colDef === '') {
  // Corrected comparison: compare the colDef string
  this.isSearchColumn = false;
  this.payload.searchString = '';
  this.payload.searchColumn = '';
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
    searchDataold() {
      // Correct the comparison to check the specific property like colDef or colHeader
      if (this.columnSearch.searchColumn && this.columnSearch.searchColumn.colDef !== '') {
        this.getContentData();
      }
    }
   
    searchData() {
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
      console.error("Invalid column selected:", this.columnSearch.searchColumn.colDef);
      return;
    }

    const filterObject = {
      column: columnKey,
      value: this.columnSearch.searchValue.trim()
    };

    this.dataSource.filter = JSON.stringify(filterObject);
  }
}
onSelectionChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  if (target) {
    this.columnSearch.searchColumn.colDef = target.value;
    this.searchColumn();
  }
}
    resetOld(){
     
      if( this.columnSearch.searchValue==''){
      
        this.getContentData()
      }
    
    }
    reset() {
      this.columnSearch.searchValue = '';
      this.dataSource.filter = '';
    }
    onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
      event.preventDefault()
      this.isActiveTrigger = true;
      setTimeout(() => {
        this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
      }, 100);
    }
  
    filterString : string = UniqueConstants.OneEqualsOne;
  
    optionSelected(filter : string) {
      this.filterString = filter;
      this.getContentData();    
      this.isActiveTrigger = false;
    }

      
     announceSortChange(sortState: Sort) {
         if (sortState.direction)
           this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
         else this._liveAnnouncer.announce('Sorting cleared');

     }
    
  
    getFloatLabelValue(): FloatLabelType {
      return this.floatLabelControl.value ?? 'auto';
    }
  
    ngOnDestroy() {
      this.onDestroy$.next(true);
      this.onDestroy$.unsubscribe();
    }
    compareObjects(o1: any, o2: any): boolean {
      return o1.colDef === o2.colDef && o1.colHeader === o2.colHeader;
    }
    
    isAuthorized(controlName:any) {
      return !this.authService.isAuthorized(controlName);
   }
  
  
  selectRow(row: any) {
    this.clickTimeout = setTimeout(() => {
      this.dataSource.filteredData.forEach(element => {
        if(row != element){
        //  element.selected = false;
        }
      });
      const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
      if (selectedRow) {
     //   selectedRow.selected = !selectedRow.selected;
      }
    }, 250);
  }
  get hasValidColumns(): boolean {
    return !!this.columnValues?.length && !!this.displayedColumns?.length;
  }
  
  }
  