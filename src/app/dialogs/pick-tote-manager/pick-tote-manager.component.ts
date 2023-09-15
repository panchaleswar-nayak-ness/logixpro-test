import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject'; 
import { AuthService } from '../../../app/init/auth.service';
import { AddFilterFunction } from '../add-filter-function/add-filter-function.component';
import labels from '../../labels/labels.json';
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-pick-tote-manager',
  templateUrl: './pick-tote-manager.component.html',
  styleUrls: ['./pick-tote-manager.component.scss']
})
export class PickToteManagerComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  isFilter: string = 'filter'
  savedFilterList: any[] = [];
  filteredOptions: Observable<any[]>;
  savedFilter = new FormControl('');
  userData: any;
  FILTER_DATA: any[] = [];
  ORDER_BY_DATA: any[] = [];
  FILTER_BATCH_DATA: any[] = [];
  FILTER_BATCH_DATA_ZONE: any[] = [];
  useDefaultFilter;
  useDefaultZone;
  batchByZoneData: any[] = [];
  F_ORDER_TRANS: any[] = [];
  TabIndex: number = 0;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  dataSource: any;
  orderBydataSource: any;
  pickBatchFilter: any;
  batchByZoneSource: any;
  filterBatchOrders: any;
  filterBatchOrdersZone: any;
  pickBatchOrder: any;
  tempHoldEle: any;
  filterOrderTransactionSource: any;
  zoneOrderTransactionSource: any;
  selectedOrders: any[] = [];
  allSelectOrders: any[] = [];
  selectedZoneOrders: any[] = [];
  filterSeq: any = '0';
  orderBySeq: any = '0';
  isFilterAdd: boolean = false;
  isOrderByAdd: boolean = false;
  isOrderSelect: boolean = true;
  isOrderSelectZone: boolean = true;
  onDestroy$: Subject<boolean> = new Subject();
  selection = new SelectionModel<PeriodicElement>(true, []);
  disFilterColumns: string[] = ['sequence', 'field', 'criteria', 'value', 'andOr', 'actions'];
  disOrderColumns: string[] = ['sequence', 'field', 'sortOrder', 'id', 'actions'];

  displayedColumns1: string[] = ['position', 'toteid', 'orderno', 'other'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('orderRef') orderRef: MatSelect;
  @ViewChild('orderZoneRef') orderZoneRef: MatSelect;
  @ViewChild(MatSort) viewFilterTransSort: MatSort;
  @ViewChild(MatSort) viewZoneTransSort: MatSort;

  displayedColumns2: string[] = ['orderno', 'requireddate', 'priority'];
  filterBatchOrderColums: string[] = ['orderno', 'requireddate', 'priority'];

  displayedColumns3: string[] = ['orderno', 'itemno', 'transaction', 'location'];
  filterBatchTransColumns = [
    { columnDef: 'orderNumber', header: 'Order Number', cell: (element: any) => `${element.orderNumber}` },
    { columnDef: 'itemNumber', header: 'Item Number', cell: (element: any) => `${element.itemNumber}` },
    { columnDef: 'transactionQuantity', header: 'Transaction Quantity', cell: (element: any) => `${element.transactionQuantity}` },
    { columnDef: 'location', header: 'Location', cell: (element: any) => `${element.location}` },
    { columnDef: 'completedQuantity', header: 'Completed Quantity', cell: (element: any) => `${element.completedQuantity}` },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element.description}` },
    { columnDef: 'importDate', header: 'Import Date', cell: (element: any) => `${element.importDate}` },
    { columnDef: 'priority', header: 'Priority', cell: (element: any) => `${element.priority}` },
    { columnDef: 'requiredDate', header: 'Required Date', cell: (element: any) => `${element.requiredDate}` },
    { columnDef: 'lineNumber', header: 'Line Number', cell: (element: any) => `${element.lineNumber}` },
    { columnDef: 'lineSequence', header: 'Line Sequence', cell: (element: any) => `${element.lineSequence}` },
    { columnDef: 'serialNumber', header: 'Serial Number', cell: (element: any) => `${element.serialNumber}` },
    { columnDef: 'lotNumber', header: 'Lot Number', cell: (element: any) => `${element.lotNumber}` },
    { columnDef: 'expirationDate', header: 'Expiration Date', cell: (element: any) => `${element.expirationDate}` },
    { columnDef: 'completedDate', header: 'Completed Date', cell: (element: any) => `${element.completedDate}` },
    { columnDef: 'completedBy', header: 'Completed By', cell: (element: any) => `${element.completedBy}` },
    { columnDef: 'batchPickID', header: 'Batch Pick ID', cell: (element: any) => `${element.batchPickID}` },
    { columnDef: 'unitOfMeasure', header: 'Unit Of Measure', cell: (element: any) => `${element.unitOfMeasure}` },
    { columnDef: 'userField1', header: 'User Field1', cell: (element: any) => `${element.userField1}` },
    { columnDef: 'userField2', header: 'User Field2', cell: (element: any) => `${element.userField2}` },
    { columnDef: 'userField3', header: 'User Field3', cell: (element: any) => `${element.userField3}` },
    { columnDef: 'userField4', header: 'User Field4', cell: (element: any) => `${element.userField4}` },
    { columnDef: 'userField5', header: 'User Field5', cell: (element: any) => `${element.userField5}` },
    { columnDef: 'userField6', header: 'User Field6', cell: (element: any) => `${element.userField6}` },
    { columnDef: 'userField7', header: 'User Field7', cell: (element: any) => `${element.userField7}` },
    { columnDef: 'userField8', header: 'User Field8', cell: (element: any) => `${element.userField8}` },
    { columnDef: 'userField9', header: 'User Field9', cell: (element: any) => `${element.userField9}` },
    { columnDef: 'userField10', header: 'User Field10', cell: (element: any) => `${element.userField10}` },
    { columnDef: 'revision', header: 'Revision', cell: (element: any) => `${element.revision}` },
    { columnDef: 'toteID', header: 'Tote ID', cell: (element: any) => `${element.toteID}` },
    { columnDef: 'toteNumber', header: 'Tote Number', cell: (element: any) => `${element.toteNumber}` },
    { columnDef: 'cell', header: 'Cell', cell: (element: any) => `${element.cell}` },
    { columnDef: 'hostTransactionID', header: 'Host Transaction ID', cell: (element: any) => `${element.hostTransactionID}` },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    { columnDef: 'zone', header: 'Zone', cell: (element: any) => `${element.zone}` },
    { columnDef: 'carousel', header: 'Carousel', cell: (element: any) => `${element.carousel}` },
    { columnDef: 'row', header: 'Row', cell: (element: any) => `${element.row}` },
    { columnDef: 'shelf', header: 'Shelf', cell: (element: any) => `${element.shelf}` },
    { columnDef: 'bin', header: 'Bin', cell: (element: any) => `${element.bin}` },
    { columnDef: 'warehouse', header: 'Warehouse', cell: (element: any) => `${element.warehouse}` },
    { columnDef: 'invMapID', header: 'Inventory Map ID', cell: (element: any) => `${element.invMapID}` },
    { columnDef: 'importBy', header: 'Import By', cell: (element: any) => `${element.importBy}` },
    { columnDef: 'importFilename', header: 'Import Filename', cell: (element: any) => `${element.importFilename}` },
    { columnDef: 'notes', header: 'Notes', cell: (element: any) => `${element.notes}` },
    { columnDef: 'emergency', header: 'Emergency', cell: (element: any) => `${element.emergency}` },
    { columnDef: 'masterRecord', header: 'Master Record', cell: (element: any) => `${element.masterRecord}` },
    { columnDef: 'masterRecordID', header: 'Master Record ID', cell: (element: any) => `${element.masterRecordID}` },
    { columnDef: 'exportBatchID', header: 'Export Batch ID', cell: (element: any) => `${element.exportBatchID}` },
    { columnDef: 'exportDate', header: 'Export Date', cell: (element: any) => `${element.exportDate}` },
    { columnDef: 'exportedBy', header: 'Exported By', cell: (element: any) => `${element.exportedBy}` },
    { columnDef: 'statusCode', header: 'Status Code', cell: (element: any) => `${element.statusCode}` },
  ];

  displayedTransColumns = this.filterBatchTransColumns.map(c => c.columnDef);

  displayedColumns4: string[] = ['select', 'zone', 'batchtype', 'totalorders', 'totallocations', 'other'];
  batchByOrderColumns: string[] = ['default', 'zone', 'batchtype', 'totalorders', 'totallocations', 'actions'];
  @ViewChild('filterBatchOrder') filterBatchOrder: MatPaginator;
  @ViewChild('filterBatchTrans') filterBatchTrans: MatPaginator;
  @ViewChild('zoneBatchOrder') zoneBatchOrder: MatPaginator;
  @ViewChild('zoneBatchTrans') zoneBatchTrans: MatPaginator;
  // @ViewChild('batchByZonePaginator', {read: true}) batchByZonePaginator: MatPaginator;
  @ViewChild('batchByZonePaginator', { static: false })
  set paginator(value: MatPaginator) {
    this.batchByZoneSource.paginator = value;
  }
  constructor(
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.savedFilterList = [];
    this.userData = this.authService.userData();
    this.getSavedFilters();
    this.dataSource = new MatTableDataSource<any>(this.FILTER_DATA);
    this.dataSource1 = new MatTableDataSource<any>(this.FILTER_DATA);
    this.orderBydataSource = new MatTableDataSource<any>(this.ORDER_BY_DATA);
    this.pickBatchZonesSelect();
    if (this.data.useDefaultFilter) {
      this.isFilter = 'filter'
    }
    else {
      this.isFilter = 'zone'
    }
    this.allSelectOrders = this.data.allOrders;
  }


  pickBatchZonesSelect() {
    let paylaod = {
      "wsid": this.userData.wsid,
    }
    this.Api.PickBatchZonesSelect(paylaod).subscribe(res => {
      if (res.data) {
        this.batchByZoneData = res.data
        this.batchByZoneSource = new MatTableDataSource<any>(this.batchByZoneData);
        // this.batchByZoneSource.paginator = this.batchByZonePaginator;
      }
    });
  }

  ngAfterViewInit() {
    // this.batchByZoneSource.paginator = this.batchByZonePaginator;
    
    setTimeout(()=>{
      this.field_focus.nativeElement.focus();  
    }, 500);
  }

  getSavedFilters() {
    let paylaod = {
      "filter": "",
      "wsid": this.userData.wsid,
    }
    this.Api.PickBatchFilterTypeAhead(paylaod).subscribe((res) => {
      if (res.data) {
        
        this.savedFilterList = res.data;
        this.filteredOptions = this.savedFilter.valueChanges.pipe(
          startWith(""),
          map(value => (typeof value === "string" ? value : value)),
          map(name => (name ? this._filter(name) : this.savedFilterList.slice()))
        );
      }
    });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.savedFilterList.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onAddFilter(filterData?: any) { 
    if (filterData) {
      filterData.map(obj => {
        this.FILTER_DATA.push({ sequence: obj.sequence, field: obj.field, criteria: obj.criteria, value: obj.value, andOr: obj.andOr, isSaved: true,is_db: true });
        this.filterSeq = obj.sequence
      });
      this.dataSource = new MatTableDataSource<any>(this.FILTER_DATA);
    }
    else {
      this.FILTER_DATA.push({ sequence: this.filterSeq + 1, field: 'Emergency', criteria: 'Equals', value: '', andOr: 'And', isSaved: false });

      this.dataSource = new MatTableDataSource<any>(this.FILTER_DATA);
      this.isFilterAdd = false;
    }
  }
  onAddOrderBy(filterData?: any) {
    if (filterData) {
      filterData.map(obj => {
        this.ORDER_BY_DATA.push({ id: obj.id, sequence: obj.sequence, field: obj.field, sortOrder: obj.order, isSaved: true });
        this.orderBySeq = obj.sequence
      });
      this.orderBydataSource = new MatTableDataSource<any>(this.ORDER_BY_DATA);
    }
    else {
      this.ORDER_BY_DATA.push({ sequence: this.orderBySeq + 1, field: 'Emergency', sortOrder: 'DESC', isSaved: false });
      this.orderBydataSource = new MatTableDataSource<any>(this.ORDER_BY_DATA);
      this.isOrderByAdd = false;
    }
  }
  onChangeFunctionsFields(elemet: any) {
    elemet.isSaved = false;
  }
  clearMatSelectList() {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  orderActionRefresh() {
    this.orderRef.options.forEach((data: MatOption) => data.deselect());
  }
  orderActionRefreshZone() {
    this.orderZoneRef.options.forEach((data: MatOption) => data.deselect());
  }
  onFilterAction(option: any) {
    if (option.value === 'add_new_filter') {
      const dialogRef = this.dialog.open(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        autoFocus: '__non_existing_element__'
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
        if(result){
          this.savedFilterList.push(result);
        this.savedFilter.setValue(result);
        this.isFilterAdd = true;
        this.isOrderByAdd = true;
        this.filterSeq = '0';
        this.orderBySeq = '0';
        this.clearMatSelectList();
        this.pickBatchFilterOrderData(result);
        }
      });
    }
    if (option.value === 'rename') {
      const dialogRef = this.dialog.open(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        data: {
          savedFilter: this.savedFilter.value
        },
        autoFocus: '__non_existing_element__'
      });
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
        this.savedFilterList = this.savedFilterList.filter(item => item !== result.oldFilter);
        this.savedFilterList.push(result.newFilter);
        this.savedFilter.setValue(result.newFilter);
        const matSelect: MatSelect = option.source;
        matSelect.writeValue(null);
      });
    }
    if (option.value === 'set_default') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '480px',
        data: {
          message: 'Mark this filter as the default one ?',
        },
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          let paylaod = {
            "Description": this.savedFilter.value,
            "wsid": this.userData.wsid
          }
          this.Api.PickBatchDefaultFilterMark(paylaod).subscribe(res => {
            if (res.isExecuted) {
              this.toastr.success(labels.alert.update, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              }); 
            }
          });
        }
        const matSelect: MatSelect = option.source;
        matSelect.writeValue(null);
      });
     
    }
    if (option.value === 'clear_default') {
      let paylaod = {
        "wsid": this.userData.wsid
      }
      this.Api.PickBatchDefaultFilterClear(paylaod).subscribe(res => {
        if (res.isExecuted) {
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          const matSelect: MatSelect = option.source;
          matSelect.writeValue(null);
        }
      });
    }
    if (option.value === 'view_default') {
      let paylaod = {
        "wsid": this.userData.wsid
      }
      this.Api.PickBatchDefaultFilterSelect(paylaod).subscribe(res => {
        if (res.data) {
          
          this.savedFilter.setValue(res.data);
          this.isFilterAdd = true;
          this.isOrderByAdd = true;
          this.filterSeq = '0';
          this.orderBySeq = '0';
          this.pickBatchFilterOrderData(res.data);
        }
        else {
          this.toastr.error('No filter is marked as default.', 'Warning!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
        const matSelect: MatSelect = option.source;
        matSelect.writeValue(null);
      });

    }
    if (option.value === 'delete_selected_filter') {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          let paylaod = {
            "Description": this.savedFilter.value,
            "wsid": this.userData.wsid
          }
          this.Api.PickBatchFilterBatchDelete(paylaod).subscribe(res => {
            if (res.isExecuted) {
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.savedFilterList = this.savedFilterList.filter(item => item !== this.savedFilter.value);
              this.savedFilter.setValue('');
              this.savedFilClosed();
              const matSelect: MatSelect = option.source;
              matSelect.writeValue(null);
            }

          });
        }
      })

    }
  }
  onSavedFilterChange(val: any) {
    if (val.option.value) {
      this.isFilterAdd = true;
      this.isOrderByAdd = true;
      this.filterSeq = '0';
      this.orderBySeq = '0';
      this.pickBatchFilterOrderData(val.option.value);
      this.ordersFilterZoneSelect();
    }
  }
  ordersFilterZoneSelect(zone = "", rp = false, type = "") {
    let payload;
    this.FILTER_BATCH_DATA_ZONE = [];
    this.filterOrderTransactionSource = [];
    this.zoneOrderTransactionSource = [];
    if (zone == "") {
      payload = {
        "Filter": this.savedFilter.value,
        "Zone": "",
        "BatchType": "",
        "UseDefFilter": 0,
        "UseDefZone": 0,
        "RP": false,
        "WSID": "TESTWSID"
      }
      this.Api.OrdersFilterZoneSelect(payload).subscribe(res => {
        if (res.data) {
          res.data.map(val => {
            this.FILTER_BATCH_DATA.push({ 'orderNumber': val.orderNumber, 'reqDate': val.reqDate, 'priority': val.priority, isSelected: false });
          });
          if (this.data.allOrders.length > 0) {
            const selectedArr = this.FILTER_BATCH_DATA.filter(element => this.data.allOrders.includes(element.orderNumber));
            
            selectedArr.map(ele => {
              ele.isSelected = true
              this.selectedOrders.push(ele.orderNumber);
            });
            this.selectedOrders = [...new Set(this.selectedOrders)];
            // this.onOrderSelect(selectedArr[selectedArr.length -1]);
          }
          this.filterBatchOrders = new MatTableDataSource<any>(this.FILTER_BATCH_DATA);
          this.filterBatchOrders.paginator = this.filterBatchOrder;
        }
      });
    }
    else {
      payload = {
        "Filter": "",
        "Zone": zone,
        "BatchType": type,
        "UseDefFilter": 0,
        "UseDefZone": 0,
        "RP": rp,
        "WSID": "TESTWSID"
      }
      this.Api.OrdersFilterZoneSelect(payload).subscribe(res => {
        if (res.data) {
          ;
          res.data.map(val => {
            this.FILTER_BATCH_DATA_ZONE.push({ 'orderNumber': val.orderNumber, 'reqDate': val.reqDate, 'priority': val.priority, isSelected: false });
          });
          if (this.data.allOrders.length > 0) {
            const selectedArr = this.FILTER_BATCH_DATA_ZONE.filter(element => this.data.allOrders.includes(element.orderNumber));
            
            selectedArr.map(ele => {
              ele.isSelected = true
              this.selectedOrders.push(ele.orderNumber);
            });
            // this.onOrderSelect(selectedArr[selectedArr.length -1]);
            this.selectedOrders = [...new Set(this.selectedOrders)];
            this.allSelectOrders = this.selectedOrders;
          }
          this.filterBatchOrdersZone = new MatTableDataSource<any>(this.FILTER_BATCH_DATA_ZONE);
          this.filterBatchOrdersZone.paginator = this.zoneBatchOrder;
          this.TabIndex = 1;
        }
      });
    }

  }

  viewReplenishZoneRecord(viewReplenish = "", element: any, rp: any) {
    if (viewReplenish == "") {
      this.ordersFilterZoneSelect(element.zone, true, element.type);

    }
    else {
      this.ordersFilterZoneSelect(element.zone, false, element.type);
    }
  }


  onOrderSelect(row: any) {
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.FILTER_BATCH_DATA.filter(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.filterOrderTransactionSource = [];
          this.isOrderSelect = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(item => item !== row.orderNumber)
      if (this.selectedOrders.length === 0) {
        this.isOrderSelect = true;
      }
    }
    else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.toastr.error('No open totes in batch', 'Batch is Filled.', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      this.FILTER_BATCH_DATA.map(v => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        }
        else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row; 

      // this.selectedOrders.push(row.orderNumber);
      this.FILTER_BATCH_DATA.filter(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelect = false;
      let paylaod = {
        "Draw": 0,
        "OrderNumber": row.orderNumber,
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": "asc",
        "Filter": "1=1",
        "Username": this.userData.username,
        "wsid": this.userData.wsid,
      }
      this.Api.PickToteTransDT(paylaod).subscribe((res) => {
        // if (res.data.length > 0) {
        ;

        this.filterOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
        this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
        this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        // }
      });
    }
    

  }


  onOrderSelectZone(row: any) {
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.FILTER_BATCH_DATA_ZONE.filter(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.zoneOrderTransactionSource = [];
          this.isOrderSelectZone = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(item => item !== row.orderNumber)

      if (this.selectedOrders.length === 0) {
        this.isOrderSelectZone = true;
      }
    }
    else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.toastr.error('No open totes in batch', 'Batch is Filled.', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      this.FILTER_BATCH_DATA_ZONE.map(v => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        }
        else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row;

      // this.selectedOrders.push(row.orderNumber);
      this.FILTER_BATCH_DATA_ZONE.filter(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelectZone = false;
      let paylaod = {
        "Draw": 0,
        "OrderNumber": row.orderNumber,
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": "asc",
        "Filter": "1=1",
        "Username": this.userData.username,
        "wsid": this.userData.wsid,
      }
      this.Api.PickToteTransDT(paylaod).subscribe((res) => {
        // if (res.data) {
        this.zoneOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
        this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
        this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        // }
      });
    }

  }
  pickBatchFilterOrderData(filter: string | null) {
    let paylaod = {
      "filter": filter,
      "wsid": this.userData.wsid,
    }
    this.Api.PickBatchFilterOrderData(paylaod).subscribe(res => {
      // console.log(res.data);

      if (res.data) {
        this.FILTER_DATA = [];
        this.ORDER_BY_DATA = [];
        this.pickBatchFilter = res.data.pickBatchFilter
        this.pickBatchOrder = res.data.pickBatchOrder
        if (!this.pickBatchFilter) {
          this.onAddFilter();
        } else {
          this.onAddFilter(this.pickBatchFilter);
        }

        if (!this.pickBatchOrder) {
          // this.onAddOrderBy();
        } else {
          this.onAddOrderBy(this.pickBatchOrder);
        }
      }
    });
  }
  savedFilClosed() {
    if (!this.savedFilter.value) {
      this.isFilterAdd = false;
      this.isOrderByAdd = false;
      this.FILTER_DATA = [];
      this.ORDER_BY_DATA = [];
      this.orderBydataSource = new MatTableDataSource<any>(this.ORDER_BY_DATA);
      this.dataSource = new MatTableDataSource<any>(this.FILTER_DATA);
    }

  }
  onChangeOrderAction(option: any) {
    if (option === 'fill_top_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        if (this.FILTER_BATCH_DATA[index]) {
          this.FILTER_BATCH_DATA[index].isSelected = true;
          this.selectedOrders.push(this.FILTER_BATCH_DATA[index].orderNumber);
        }
      }
      this.isOrderSelect = false;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.FILTER_BATCH_DATA.map(ele => {
        ele.isSelected = false;
        ele.priority = '';
        this.selectedOrders = [];
      });
      this.isOrderSelect = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'select_order') {
      if (this.tempHoldEle) {
        this.tempHoldEle.isSelected = true;
        if (!this.selectedOrders.includes(this.tempHoldEle.orderNumber)) {
          this.selectedOrders.push(this.tempHoldEle.orderNumber);
        }
      }
      

      this.onCloseAllPickToteManager();
    }
    this.orderActionRefresh();
  }


  onChangeOrderActionZone(option: any) {
    if (option === 'fill_top_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        if (this.FILTER_BATCH_DATA_ZONE[index]) {
          this.FILTER_BATCH_DATA_ZONE[index].isSelected = true;
          this.selectedOrders.push(this.FILTER_BATCH_DATA_ZONE[index].orderNumber);
        }
      }
      this.isOrderSelectZone = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.FILTER_BATCH_DATA_ZONE.map(ele => {
        ele.isSelected = false;
        ele.priority = '';
        this.selectedOrders = [];
      });
      this.isOrderSelectZone = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'select_order') {
      if (this.tempHoldEle) {
        this.tempHoldEle.isSelected = true;
        if (!this.selectedOrders.includes(this.tempHoldEle.orderNumber)) {
          this.selectedOrders.push(this.tempHoldEle.orderNumber);
        }
      }
      // this.selectedOrders.push(this.tempHoldEle.orderNumber);
      this.onCloseAllPickToteManager();
    }
    this.orderActionRefreshZone();
  }
  onViewOrderLineZone(event) {
    let orderNum = '';
    this.FILTER_BATCH_DATA_ZONE.map(val => {
      orderNum += val.orderNumber + ','
    })

    if (event.value === 'vAllOrderZone') {
      let paylaod = {
        "Draw": 0,
        "OrderNumber": orderNum,
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": "asc",
        "Filter": "1=1",
        "Username": this.userData.username,
        "wsid": this.userData.wsid,
      }
      this.Api.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.zoneOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
          this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
          this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        }
      });
    }
    if (event.value === 'vSelectedOrderZone') {
      orderNum = '';
      this.FILTER_BATCH_DATA_ZONE.map(val => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ','
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          "Draw": 0,
          "OrderNumber": orderNum,
          "sRow": 1,
          "eRow": 10,
          "SortColumnNumber": 0,
          "SortOrder": "asc",
          "Filter": "1=1",
          "Username": this.userData.username,
          "wsid": this.userData.wsid,
        }
        this.Api.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.zoneOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
            this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
            this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
          }
        });
      }
      else {
        this.zoneOrderTransactionSource = [];
      }


    }
  }
  onViewOrderLineFilter(event) {
    let orderNum = '';
    this.FILTER_BATCH_DATA.map(val => {
      orderNum += val.orderNumber + ','
    })

    if (event.value === 'vAllOrderFilter') {
      let paylaod = {
        "Draw": 0,
        "OrderNumber": orderNum ? orderNum : 'EAGLES',
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": "asc",
        "Filter": "1=1",
        "Username": this.userData.username,
        "wsid": this.userData.wsid,
      }
      this.Api.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.filterOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
          this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
          this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        }
      });
    }
    if (event.value === 'vSelectedOrderFilter') {
      orderNum = '';
      this.FILTER_BATCH_DATA.map(val => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ','
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          "Draw": 0,
          "OrderNumber": orderNum,
          "sRow": 1,
          "eRow": 10,
          "SortColumnNumber": 0,
          "SortOrder": "asc",
          "Filter": "1=1",
          "Username": this.userData.username,
          "wsid": this.userData.wsid,
        }
        this.Api.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.filterOrderTransactionSource = new MatTableDataSource<any>(res.data.pickToteManTrans);
            this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
            this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
          }
        });
      }
      else {
        this.filterOrderTransactionSource = [];
      }


    }
  }

  onSaveSingleFilter(element: any) {
    if (element.value === '') {
      this.toastr.error('Some of the inputs are missing values. Cannot add row to filter.', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let payload = {
        "Sequence": element.sequence,
        "Field": element.field,
        "Criteria": element.criteria,
        "Value": element.value,
        "AndOr": element.andOr,
        "Description": this.savedFilter.value,
        "wsid": this.userData.wsid,
      }
      this.FILTER_DATA.map(val => {

        // console.log(val);
        
        
        if (val.is_db) {
          this.Api.PickBatchFilterUpdate(payload).subscribe(res => {
            if (res.isExecuted) {
              this.isFilterAdd = true;
              this.toastr.success(labels.alert.update, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.filterSeq = element.sequence;
              this.pickBatchFilterOrderData(this.savedFilter.value);
            }
          });
        }
        else {
          this.Api.PickBatchFilterInsert(payload).subscribe(res => {
            if (res.isExecuted) {
              this.isFilterAdd = true;
              this.toastr.success(labels.alert.success, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.filterSeq = element.sequence;
              this.pickBatchFilterOrderData(this.savedFilter.value);
            }
          });
        }
      })

    }
  }
  onSaveSingleOrder(element: any) {
    if (element.id) {
      let payload = {
        "id": +element.id,
        "Sequence": element.sequence,
        "Field": element.field,
        "Order": element.sortOrder,
        "Description": this.savedFilter.value,
        "wsid": this.userData.wsid,
      }
      this.Api.PickBatchOrderUpdate(payload).subscribe(res => {
        if (res.isExecuted) {
          this.isOrderByAdd = true;
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });
    }
    else {
      let payload = {
        "Sequence": element.sequence,
        "Field": element.field,
        "Order": element.sortOrder,
        "Description": this.savedFilter.value,
        "wsid": this.userData.wsid,
      }
      this.Api.PickBatchOrderInsert(payload).subscribe(res => {
        if (res.isExecuted) {
          this.isOrderByAdd = true;
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          element.id = res.data;
          this.orderBySeq = element.sequence;
        }
      });
    }
    this.pickBatchFilterOrderData(this.savedFilter.value);

  }
  isUniqueSeq(element: any) {

    let res: any = [];
    this.orderBydataSource.filteredData.map( (item) => {
      var existItem = res.find((x: any) => x.sequence == item.sequence);
      if (existItem) {
        // console.log("item already exist");
        // console.log(existItem);
        this.toastr.error('Can\'t have conflicting sequences within the order rows. A new sequence has been provided', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        element.sequence = +existItem.sequence + 1;
      }
      else {
        res.push(item);
      }
    });

  }
  onDeleteSingleFilter(element: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        let payload = {
          "Sequence": element.sequence,
          "Description": this.savedFilter.value,
          "wsid": this.userData.wsid,
        }
        this.Api.PickBatchFilterDelete(payload).subscribe(res => {
          if (res.isExecuted) {
            this.isFilterAdd = true;
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.pickBatchFilterOrderData(this.savedFilter.value);
          }
        });
      }
    });
  }
  onDeleteSingleOrder(element: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        ErrorMessage: "Are you sure you want to delete this order by row?"
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        let payload = {
          "id": element.id,
          "wsid": this.userData.wsid,
        }
        this.Api.PickBatchOrderDelete(payload).subscribe(res => {
          if (res.isExecuted) {
            this.isFilterAdd = true;
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.pickBatchFilterOrderData(this.savedFilter.value);
          }
        });
      }
    });
  }

  onClosePickToteManager() {

    let selectedObj: any = [];
    let currentObjArr: any = [];
    if (this.isFilter === 'filter') {
      if (this.allSelectOrders.length > 0) {
        selectedObj = this.FILTER_BATCH_DATA.filter(element => this.allSelectOrders.includes(element.orderNumber));
        selectedObj = [...new Map(selectedObj.map(item => [item.orderNumber, item])).values()]

        let orderNumbers = new Set(selectedObj.map(d => d.orderNumber));
        currentObjArr = [...selectedObj, ...this.data.resultObj.filter(d => !orderNumbers.has(d.orderNumber))];
      }

    }
    else {
      // console.log(this.allSelectOrders);
      if (this.allSelectOrders.length > 0) {
        selectedObj = this.FILTER_BATCH_DATA_ZONE.filter(element => this.allSelectOrders.includes(element.orderNumber));
        selectedObj = [...new Map(selectedObj.map(item => [item.orderNumber, item])).values()]

        let orderNumbers = new Set(selectedObj.map(d => d.orderNumber));
        currentObjArr = [...selectedObj, ...this.data.resultObj.filter(d => !orderNumbers.has(d.orderNumber))];
      }
    }
    // console.log(currentObjArr);

    this.dialogRef.close(currentObjArr);
  }

  onCloseAllPickToteManager() {
    this.allSelectOrders = this.selectedOrders
  }

  onSelectBatchZone(row) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '480px',
      data: {
        message: 'Mark this filter as a default one ?'
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        let payload = {
          "zone": row.zone,
          "type": row.type,
          "wsid": this.userData.wsid,
        }
        this.Api.PickBatchZoneDefaultMark(payload).subscribe(res => {
          if (res.isExecuted) {
            this.toastr.success(labels.alert.update, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
    });

  }

  tabChange(event:any){
    console.log(event);
    if(event.index == 1){
      // this.onViewOrderLineFilter({value:'vSelectedOrderFilter'});
    }
  }
}


