import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../init/auth.service'; 
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, from, Observable, Subject } from 'rxjs'; 
import { ApiFuntions } from '../services/ApiFuntions';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public columnValues: any = [];
  public dataSource: any = new MatTableDataSource();
  public userData: any;
  fieldNames:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public sortCol: any = 3;
  public sortOrder: any = 'asc';
  pageEvent: PageEvent;
  searchValue: any = '';
  searchAutocompleteList: any;
  searchByInput: any = new Subject<string>();
  @ViewChild(MatSort) sort: MatSort;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  picksOpen = 0;
  picksCompleted = 0;
  picksPerHour = 0;

  putsOpen = 0;
  putsCompleted = 0;
  putsPerHour = 0;

  countOpen = 0;
  countCompleted = 0;
  countPerHour = 0;

  adjustmentOpen = 0;
  adjustmentCompleted = 0;
  adjustmentPerHour = 0;

  reprocessOpen = 0;
  reprocessCompleted = 0;
  reprocessPerHour = 0;

  cols = [];
  customPagination: any = {
    total: '',
    recordsPerPage: 20,
    startIndex: 0,
    endIndex: 20,
  };
  columnSearch: any = {
    searchColumn: {
      colHeader: '',
      colDef: '',
    },
    searchValue: '',
  };
  sortColumn: any = {
    columnName: 3,
    sortOrder: 'asc',
  };
  public Order_Table_Config = [
    { colHeader: 'zone', colDef: 'Zone' },
    { colHeader: 'warehouse', colDef: 'Warehouse' },
    { colHeader: 'locationName', colDef: 'Location' },
    { colHeader: 'totalPicks', colDef: 'Lines' },
    { colHeader: 'transactionType', colDef: 'Transaction Type' },
  ];



  public displayedColumns: string[] = [
    'zone',
    'warehouse',
    'locationName',
    'totalPicks',
    'transactionType',
  ];

  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  constructor(
    public authService: AuthService, 
    private api:ApiFuntions,
    private _liveAnnouncer: LiveAnnouncer,
   
  ) {}
  inventoryDetail = new FormGroup({
    item: new FormControl({ value: '', disabled: true }),
    description: new FormControl({ value: '', disabled: true }),
    supplierNo: new FormControl({ value: '', disabled: true }),
    minRTSReelQty: new FormControl({ value: '', disabled: true }),
    primaryPickZone: new FormControl({ value: '', disabled: true }),
    secondaryPickZone: new FormControl({ value: '', disabled: true }),
    category: new FormControl({ value: '', disabled: true }),
    subCategory: new FormControl({ value: '', disabled: true }),
    manufacture: new FormControl({ value: '', disabled: true }),
    model: new FormControl({ value: '', disabled: true }),
    supplierItemID: new FormControl({ value: '', disabled: true }),
    avgPieceWeight: new FormControl({ value: '', disabled: true }),
    um: new FormControl({ value: '', disabled: true }),
    minUseScaleQty: new FormControl({ value: '', disabled: true }),
    pickSequence: new FormControl({ value: '', disabled: true }),
    unitCost: new FormControl({ value: '', disabled: true }),
    caseQty: new FormControl({ value: '', disabled: true }),
    carouselMaxQty: new FormControl({ value: '', disabled: true }),
    carouselCellSize: new FormControl({ value: '', disabled: true }),
    carouselVelocity: new FormControl({ value: '', disabled: true }),
    carouselMinQty: new FormControl({ value: '', disabled: true }),
    sampleQty: new FormControl({ value: '', disabled: true }),
    bulkCellSize: new FormControl({ value: '', disabled: true }),
    bulkVelocity: new FormControl({ value: '', disabled: true }),
    bulkMinQty: new FormControl({ value: '', disabled: true }),
    bulkMaxQty: new FormControl({ value: '', disabled: true }),
    cfCellSize: new FormControl({ value: '', disabled: true }),
    cfVelocity: new FormControl({ value: '', disabled: true }),
    cfMinQty: new FormControl({ value: '', disabled: true }),
    cfMaxQty: new FormControl({ value: '', disabled: true }),
    reorderPoint: new FormControl({ value: '', disabled: true }),
    reorderQty: new FormControl({ value: '', disabled: true }),
    replenishmentPoint: new FormControl({ value: '', disabled: true }),
    replenishmentLevel: new FormControl({ value: '', disabled: true }),
    useScale: new FormControl({ value: 'No', disabled: true }),
    includeRTSUpdate: new FormControl({ value: 'No', disabled: true }),
    fifo: new FormControl({ value: 'No', disabled: true }),
    dateSensitive: new FormControl({ value: 'No', disabled: true }),
    wareHouseSensitive: new FormControl({ value: 'No', disabled: true }),
    splitCase: new FormControl({ value: 'No', disabled: true }),
    active: new FormControl({ value: 'No', disabled: true }),
    specialFeatures: new FormControl({ value: '', disabled: true }),
  });
  ngOnInit(): void {
    this.OSFieldFilterNames();
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.searchValue = value;
        this.autocompleteSearchColumn();
      });
    this.userData = this.authService.userData(); 
    this.getAdminMenu();
  }
  searchData() {
    if (
      this.columnSearch.searchColumn ||
      this.columnSearch.searchColumn == ''
    ) {
      this.getInvDetailsList();
    }
  }
  public OSFieldFilterNames() { 
    this.api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
    })
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
     
      stockCode:this.searchValue,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };

    this.api.location(searchPayload).subscribe(
        (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        (error) => {}
      );
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  clearFields(){
    this.inventoryDetail.reset();
    this.searchValue='';
    this.searchAutocompleteList.length=0;
  }

  getInvDetailsList() {
    let payload = {
      itemNumber: this.searchValue,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
 this.api.Inventorymasterdata(payload).subscribe((res: any) => {
          if (res.isExecuted) {
            this.inventoryDetail.get("item")?.setValue(res.data?.itemNumber);
            this.inventoryDetail.get("description")?.setValue(res.data?.description);
            this.inventoryDetail.get("supplierNo")?.setValue(res.data?.supplierItemID);
            this.inventoryDetail.get("minRTSReelQty")?.setValue(res.data?.minimumRTSReelQuantity);
            this.inventoryDetail.get("primaryPickZone")?.setValue(res.data?.primaryPickZone);
            this.inventoryDetail.get("secondaryPickZone")?.setValue(res.data?.secondaryPickZone);
            this.inventoryDetail.get("category")?.setValue(res.data?.category);
            this.inventoryDetail.get("subCategory")?.setValue(res.data?.subCategory);
            this.inventoryDetail.get("manufacture")?.setValue(res.data?.manufacturer);
            this.inventoryDetail.get("model")?.setValue(res.data?.model);
            this.inventoryDetail.get("supplierItemID")?.setValue(res.data?.supplierItemID);
            this.inventoryDetail.get("avgPieceWeight")?.setValue(res.data?.avgPieceWeight);
            this.inventoryDetail.get("um")?.setValue(res.data?.unitOfMeasure);
            this.inventoryDetail.get("minUseScaleQty")?.setValue(res.data?.minimumUseScaleQuantity);
            this.inventoryDetail.get("pickSequence")?.setValue(res.data?.pickSequence);
            this.inventoryDetail.get("unitCost")?.setValue(res.data?.unitCost);
            this.inventoryDetail.get("caseQty")?.setValue(res.data?.caseQuantity);
            this.inventoryDetail.get("carouselMaxQty")?.setValue(res.data?.maximumQuantity);
            this.inventoryDetail.get("carouselCellSize")?.setValue(res.data?.cellSize);
            this.inventoryDetail.get("carouselVelocity")?.setValue(res.data?.goldenZone);
            this.inventoryDetail.get("carouselMinQty")?.setValue(res.data?.minimumQuantity);
            this.inventoryDetail.get("sampleQty")?.setValue(res.data?.sampleQuantity);
            this.inventoryDetail.get("bulkCellSize")?.setValue(res.data?.bulkCellSize);
            this.inventoryDetail.get("bulkMinQty")?.setValue(res.data?.bulkMinimumQuantity);
            this.inventoryDetail.get("bulkMaxQty")?.setValue(res.data?.bulkMaximumQuantity);
            this.inventoryDetail.get("cfCellSize")?.setValue(res.data?.cfCellSize);
            this.inventoryDetail.get("cfVelocity")?.setValue(res.data?.cfVelocity);
            this.inventoryDetail.get("cfMinQty")?.setValue(res.data?.cfMinimumQuantity);
            this.inventoryDetail.get("cfMaxQty")?.setValue(res.data?.cfMaximumQuantity);
            this.inventoryDetail.get("reorderPoint")?.setValue(res.data?.reorderPoint);
            this.inventoryDetail.get("reorderQty")?.setValue(res.data?.reorderQuantity);
            this.inventoryDetail.get("replenishmentPoint")?.setValue(res.data?.reorderPoint);
            this.inventoryDetail.get("replenishmentLevel")?.setValue(res.data?.replenishmentLevel);
            this.inventoryDetail.get("includeRTSUpdate")?.setValue(res.data && res.data.includeInAutoRTSUpdate?'Yes':'No');
            this.inventoryDetail.get("fifo")?.setValue(res.data && res.data.fifo?'Yes':'No' );
            this.inventoryDetail.get("dateSensitive")?.setValue(res.data && res.data.dateSensitive?'Yes':'No');
            this.inventoryDetail.get("wareHouseSensitive")?.setValue(res.data && res.data.warehouseSensitive?'Yes':'No');
            this.inventoryDetail.get("active")?.setValue( res.data && res.data.active?'Yes':'No' );
            this.inventoryDetail.get("specialFeatures")?.setValue(res.data?.specialFeatures);
            this.inventoryDetail.get("bulkVelocity")?.setValue(res.data?.bulkVelocity);
            this.inventoryDetail.get("useScale")?.setValue( res.data && res.data.useScale?'Yes':'No' );
            this.inventoryDetail.get("splitCase")?.setValue( res.data && res.data.splitCase?'Yes':'No' );
   
          }
        },
        (error) => {}
      );
  }
  sortChange(event) {
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortOrder
    )
      return;

    let index;
    this.displayedColumns.find((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    // this.getContentData();
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    // this.customPagination.startIndex =  e.pageIndex
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    // this.length = e.length;
    this.customPagination.recordsPerPage = e.pageSize;
    // this.pageIndex = e.pageIndex;

    // this.initializeApi();
    // this.getContentData();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.dataSource.sort = this.sort;
  }
  getAdminMenu() { 
    this.api.GetAdminMenu().subscribe((res: any) => {
        if (res && res?.data?.totalOrders) {
          this.dataSource = new MatTableDataSource(
            res.data.totalOrders.orderTable
          );
        }
        if (res && res.data.totalOrders && res.data.totalOrders.adminValues) {
          let item = res.data.totalOrders.adminValues;
          this.picksOpen = item.openPicks;
          this.picksCompleted = item.completedPicksToday;
          this.picksPerHour = item.completedPickHours;

          this.putsOpen = item.openPuts;
          this.putsCompleted = item.completedPutsToday;

          this.countOpen = item.openCounts;
          this.countCompleted = item.completedCountsToday;

          this.adjustmentOpen = item.adjustmentsToday;

          this.reprocessOpen = item.reprocess;
        }
      });
  }
  isLookUp = false;

  backAdminAction() {
  this.isLookUp = !this.isLookUp;
  setTimeout(()=>{
    this.searchBoxField.nativeElement.focus();

  }, 500);

  }

  ngOnDestroy() {
    this.searchByInput.unsubscribe();
  }
}
