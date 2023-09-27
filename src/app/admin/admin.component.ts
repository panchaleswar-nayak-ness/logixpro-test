import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../init/auth.service'; 
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
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

    this.api.location(searchPayload).subscribe({
      next: (res: any) => {
        this.searchAutocompleteList = res.data;
      },
      error: (error) => {},
      
    });
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
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
    this.api.Inventorymasterdata(payload).subscribe({
      next: (res: any) => {
        if (res.isExecuted) {
          const data = res.data;
          this.inventoryDetail.get("item")?.setValue(data?.itemNumber);
          this.inventoryDetail.get("description")?.setValue(data?.description);
          this.inventoryDetail.get("supplierNo")?.setValue(data?.supplierItemID);
          this.inventoryDetail.get("minRTSReelQty")?.setValue(data?.minimumRTSReelQuantity);
          this.inventoryDetail.get("primaryPickZone")?.setValue(data?.primaryPickZone);
          this.inventoryDetail.get("secondaryPickZone")?.setValue(data?.secondaryPickZone);
          this.inventoryDetail.get("category")?.setValue(data?.category);
          this.inventoryDetail.get("subCategory")?.setValue(data?.subCategory);
          this.inventoryDetail.get("manufacture")?.setValue(data?.manufacturer);
          this.inventoryDetail.get("model")?.setValue(data?.model);
          this.inventoryDetail.get("supplierItemID")?.setValue(data?.supplierItemID);
          this.inventoryDetail.get("avgPieceWeight")?.setValue(data?.avgPieceWeight);
          this.inventoryDetail.get("um")?.setValue(data?.unitOfMeasure);
          this.inventoryDetail.get("minUseScaleQty")?.setValue(data?.minimumUseScaleQuantity);
          this.inventoryDetail.get("pickSequence")?.setValue(data?.pickSequence);
          this.inventoryDetail.get("unitCost")?.setValue(data?.unitCost);
          this.inventoryDetail.get("caseQty")?.setValue(data?.caseQuantity);
          this.inventoryDetail.get("carouselMaxQty")?.setValue(data?.maximumQuantity);
          this.inventoryDetail.get("carouselCellSize")?.setValue(data?.cellSize);
          this.inventoryDetail.get("carouselVelocity")?.setValue(data?.goldenZone);
          this.inventoryDetail.get("carouselMinQty")?.setValue(data?.minimumQuantity);
          this.inventoryDetail.get("sampleQty")?.setValue(data?.sampleQuantity);
          this.inventoryDetail.get("bulkCellSize")?.setValue(data?.bulkCellSize);
          this.inventoryDetail.get("bulkMinQty")?.setValue(data?.bulkMinimumQuantity);
          this.inventoryDetail.get("bulkMaxQty")?.setValue(data?.bulkMaximumQuantity);
          this.inventoryDetail.get("cfCellSize")?.setValue(data?.cfCellSize);
          this.inventoryDetail.get("cfVelocity")?.setValue(data?.cfVelocity);
          this.inventoryDetail.get("cfMinQty")?.setValue(data?.cfMinimumQuantity);
          this.inventoryDetail.get("cfMaxQty")?.setValue(data?.cfMaximumQuantity);
          this.inventoryDetail.get("reorderPoint")?.setValue(data?.reorderPoint);
          this.inventoryDetail.get("reorderQty")?.setValue(data?.reorderQuantity);
          this.inventoryDetail.get("replenishmentPoint")?.setValue(data?.reorderPoint);
          this.inventoryDetail.get("replenishmentLevel")?.setValue(data?.replenishmentLevel);
          this.inventoryDetail.get("includeRTSUpdate")?.setValue(data?.includeInAutoRTSUpdate ? 'Yes' : 'No');
          this.inventoryDetail.get("fifo")?.setValue(data && data?.fifo ? 'Yes' : 'No');
          this.inventoryDetail.get("dateSensitive")?.setValue(data?.dateSensitive ? 'Yes' : 'No');
          this.inventoryDetail.get("wareHouseSensitive")?.setValue(data?.warehouseSensitive ? 'Yes' : 'No');
          this.inventoryDetail.get("active")?.setValue(data?.active ? 'Yes' : 'No');
          this.inventoryDetail.get("specialFeatures")?.setValue(data?.specialFeatures);
          this.inventoryDetail.get("bulkVelocity")?.setValue(data?.bulkVelocity);
          this.inventoryDetail.get("useScale")?.setValue(data?.useScale ? 'Yes' : 'No');
          this.inventoryDetail.get("splitCase")?.setValue(data?.splitCase ? 'Yes' : 'No');
        }
      },
      error: (error) => {},
      
    });
  }
  sortChange(event) {
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortOrder
    )
      return;

    let index;
    this.displayedColumns.forEach((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
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
        if ( res?.data?.totalOrders) {
          this.dataSource = new MatTableDataSource(
            res.data.totalOrders.orderTable
          );
        }
        if (res?.data?.totalOrders?.adminValues) {
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
