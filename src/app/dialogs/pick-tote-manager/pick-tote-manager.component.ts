import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table'; 
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from '../../common/init/auth.service';
import { AddFilterFunction } from '../add-filter-function/add-filter-function.component';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  TableConstant ,ToasterTitle,ResponseStrings,Column,ToasterType,zoneType,DialogConstants,ColumnDef,UniqueConstants} from 'src/app/common/constants/strings.constants';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-pick-tote-manager',
  templateUrl: './pick-tote-manager.component.html',
  styleUrls: ['./pick-tote-manager.component.scss'],
})
export class PickToteManagerComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  ];

  @ViewChild('field_focus') field_focus: ElementRef;

  isFilter: string = 'filter';
  savedFilterList: any[] = [];
  filteredOptions: Observable<any[]>;
  savedFilter = new FormControl('');
  userData: any;
  filterData: any[] = [];
  orderByData: any[] = [];
  filterBatchData: any[] = [];
  filterBatchDataZone: any[] = [];
  useDefaultFilter;
  useDefaultZone;
  batchByZoneData: any[] = []; 
  tabIndex: number = 0;
 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
 
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
 
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
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
  disFilterColumns: string[] = [
    'sequence',
    'field',
    'criteria',
    'value',
    'andOr',
    'actions',
  ];
  disOrderColumns: string[] = [
    'sequence',
    'field',
    'sortOrder',
    'id',
    'actions',
  ];

  displayedColumns1: string[] = [UniqueConstants.position, 'toteid', 'orderno', 'other'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('orderRef') orderRef: MatSelect;
  @ViewChild('orderZoneRef') orderZoneRef: MatSelect;
  @ViewChild(MatSort) viewFilterTransSort: MatSort;
  @ViewChild(MatSort) viewZoneTransSort: MatSort;

  displayedColumns2: string[] = ['orderno', 'requireddate', 'priority'];
  filterBatchOrderColums: string[] = ['orderno', 'requireddate', 'priority'];

  displayedColumns3: string[] = [
    'orderno',
    'itemno',
    'transaction',
    'location',
  ];
  filterBatchTransColumns = [
    {
      columnDef: 'orderNumber',
      header: Column.OrderNumber,
      cell: (element: any) => `${element.orderNumber}`,
    },
    {
      columnDef: 'itemNumber',
      header: Column.ItemNumber,
      cell: (element: any) => `${element.itemNumber}`,
    },
    {
      columnDef: 'transactionQuantity',
      header: 'Transaction Quantity',
      cell: (element: any) => `${element.transactionQuantity}`,
    },
    {
      columnDef: 'location',
      header: Column.Location,
      cell: (element: any) => `${element.location}`,
    },
    {
      columnDef: 'completedQuantity',
      header: 'Completed Quantity',
      cell: (element: any) => `${element.completedQuantity}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: any) => `${element.description}`,
    },
    {
      columnDef: 'importDate',
      header: 'Import Date',
      cell: (element: any) => `${element.importDate}`,
    },
    {
      columnDef: 'priority',
      header: 'Priority',
      cell: (element: any) => `${element.priority}`,
    },
    {
      columnDef: 'requiredDate',
      header: 'Required Date',
      cell: (element: any) => `${element.requiredDate}`,
    },
    {
      columnDef: 'lineNumber',
      header: 'Line Number',
      cell: (element: any) => `${element.lineNumber}`,
    },
    {
      columnDef: TableConstant.LineSequence,
      header: 'Line Sequence',
      cell: (element: any) => `${element.lineSequence}`,
    },
    {
      columnDef: 'serialNumber',
      header: 'Serial Number',
      cell: (element: any) => `${element.serialNumber}`,
    },
    {
      columnDef: 'lotNumber',
      header: Column.LotNumber,
      cell: (element: any) => `${element.lotNumber}`,
    },
    {
      columnDef: 'expirationDate',
      header: TableConstant.ExpirationDate,
      cell: (element: any) => `${element.expirationDate}`,
    },
    {
      columnDef: 'completedDate',
      header: TableConstant.CompletedDate,
      cell: (element: any) => `${element.completedDate}`,
    },
    {
      columnDef: 'completedBy',
      header: 'Completed By',
      cell: (element: any) => `${element.completedBy}`,
    },
    {
      columnDef: 'batchPickID',
      header: 'Batch Pick ID',
      cell: (element: any) => `${element.batchPickID}`,
    },
    {
      columnDef: 'unitOfMeasure',
      header: 'Unit Of Measure',
      cell: (element: any) => `${element.unitOfMeasure}`,
    },
    {
      columnDef: ColumnDef.userField1,
      header: TableConstant.UserField1,
      cell: (element: any) => `${element.userField1}`,
    },
    {
      columnDef: ColumnDef.userField2,
      header: TableConstant.UserField2,
      cell: (element: any) => `${element.userField2}`,
    },
    {
      columnDef: ColumnDef.userField3,
      header: 'User Field3',
      cell: (element: any) => `${element.userField3}`,
    },
    {
      columnDef: ColumnDef.userField4,
      header: 'User Field4',
      cell: (element: any) => `${element.userField4}`,
    },
    {
      columnDef: ColumnDef.userField5,
      header: 'User Field5',
      cell: (element: any) => `${element.userField5}`,
    },
    {
      columnDef: ColumnDef.userField6,
      header: 'User Field6',
      cell: (element: any) => `${element.userField6}`,
    },
    {
      columnDef: ColumnDef.userField7,
      header: 'User Field7',
      cell: (element: any) => `${element.userField7}`,
    },
    {
      columnDef: ColumnDef.userField8,
      header: 'User Field8',
      cell: (element: any) => `${element.userField8}`,
    },
    {
      columnDef: ColumnDef.userField9,
      header: 'User Field9',
      cell: (element: any) => `${element.userField9}`,
    },
    {
      columnDef: ColumnDef.userField10,
      header: 'User Field10',
      cell: (element: any) => `${element.userField10}`,
    },
    {
      columnDef: 'revision',
      header: TableConstant.Revision,
      cell: (element: any) => `${element.revision}`,
    },
    {
      columnDef: 'toteID',
      header: Column.ToteID,
      cell: (element: any) => `${element.toteID}`,
    },
    {
      columnDef: 'toteNumber',
      header: 'Tote Number',
      cell: (element: any) => `${element.toteNumber}`,
    },
    {
      columnDef: 'cell',
      header: 'Cell',
      cell: (element: any) => `${element.cell}`,
    },
    {
      columnDef: 'hostTransactionID',
      header: TableConstant.HostTransactionID,
      cell: (element: any) => `${element.hostTransactionID}`,
    },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    {
      columnDef: 'zone',
      header: 'Zone',
      cell: (element: any) => `${element.zone}`,
    },
    {
      columnDef: zoneType.carousel,
      header: 'Carousel',
      cell: (element: any) => `${element.carousel}`,
    },
    {
      columnDef: 'row',
      header: 'Row',
      cell: (element: any) => `${element.row}`,
    },
    {
      columnDef: 'shelf',
      header: 'Shelf',
      cell: (element: any) => `${element.shelf}`,
    },
    {
      columnDef: 'bin',
      header: 'Bin',
      cell: (element: any) => `${element.bin}`,
    },
    {
      columnDef: 'warehouse',
      header: 'Warehouse',
      cell: (element: any) => `${element.warehouse}`,
    },
    {
      columnDef: 'invMapID',
      header: 'Inventory Map ID',
      cell: (element: any) => `${element.invMapID}`,
    },
    {
      columnDef: 'importBy',
      header: 'Import By',
      cell: (element: any) => `${element.importBy}`,
    },
    {
      columnDef: 'importFilename',
      header: 'Import Filename',
      cell: (element: any) => `${element.importFilename}`,
    },
    {
      columnDef: 'notes',
      header: 'Notes',
      cell: (element: any) => `${element.notes}`,
    },
    {
      columnDef: 'emergency',
      header: 'Emergency',
      cell: (element: any) => `${element.emergency}`,
    },
    {
      columnDef: 'masterRecord',
      header: 'Master Record',
      cell: (element: any) => `${element.masterRecord}`,
    },
    {
      columnDef: 'masterRecordID',
      header: 'Master Record ID',
      cell: (element: any) => `${element.masterRecordID}`,
    },
    {
      columnDef: 'exportBatchID',
      header: 'Export Batch ID',
      cell: (element: any) => `${element.exportBatchID}`,
    },
    {
      columnDef: 'exportDate',
      header: 'Export Date',
      cell: (element: any) => `${element.exportDate}`,
    },
    {
      columnDef: 'exportedBy',
      header: 'Exported By',
      cell: (element: any) => `${element.exportedBy}`,
    },
    {
      columnDef: 'statusCode',
      header: 'Status Code',
      cell: (element: any) => `${element.statusCode}`,
    },
  ];

  displayedTransColumns = this.filterBatchTransColumns.map((c) => c.columnDef);

  displayedColumns4: string[] = [
    'select',
    'zone',
    'batchtype',
    'totalorders',
    'totallocations',
    'other',
  ];
  batchByOrderColumns: string[] = [
    'default',
    'zone',
    'batchtype',
    'totalorders',
    'totallocations',
    'actions',
  ];
  @ViewChild('filterBatchOrder') filterBatchOrder: MatPaginator;
  @ViewChild('filterBatchTrans') filterBatchTrans: MatPaginator;
  @ViewChild('zoneBatchOrder') zoneBatchOrder: MatPaginator;
  @ViewChild('zoneBatchTrans') zoneBatchTrans: MatPaginator;
  @ViewChild('batchByZonePaginator', { static: false })
  set paginator(value: MatPaginator) {
    this.batchByZoneSource.paginator = value;
  }
  public iInductionManagerApi: IInductionManagerApiService;
  constructor(
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.savedFilterList = [];
    this.userData = this.authService.userData();
    this.getSavedFilters();
    this.dataSource = new MatTableDataSource<any>(this.filterData);
    this.dataSource1 = new MatTableDataSource<any>(this.filterData);
    this.orderBydataSource = new MatTableDataSource<any>(this.orderByData);
    this.pickBatchZonesSelect();
    if (this.data.useDefaultFilter) {
      this.isFilter = 'filter';
    } else {
      this.isFilter = 'zone';
    }
    this.allSelectOrders = this.data.allOrders;
  }

  pickBatchZonesSelect() {
    let paylaod = {};
    this.iInductionManagerApi.PickBatchZonesSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.batchByZoneData = res.data;
        this.batchByZoneSource = new MatTableDataSource<any>(
          this.batchByZoneData
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('PickBatchZonesSelect', res.responseMessage);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.field_focus.nativeElement.focus();
    }, 500);
  }

  getSavedFilters() {
    let paylaod = {
      filter: '',
    };
    this.iInductionManagerApi
      .PickBatchFilterTypeAhead(paylaod)
      .subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.savedFilterList = res.data;
          this.filteredOptions = this.savedFilter.valueChanges.pipe(
            startWith(''),
            map((value) => value),
            map((name) =>
              name ? this._filter(name) : this.savedFilterList.slice()
            )
          );
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickBatchFilterTypeAhead', res.responseMessage);
        }
      });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.savedFilterList.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onAddFilter(filterData?: any) {
    if (filterData) {
      filterData.map((obj) => {
        this.filterData.push({
          sequence: obj.sequence,
          field: obj.field,
          criteria: obj.criteria,
          value: obj.value,
          andOr: obj.andOr,
          isSaved: true,
          is_db: true,
        });
        this.filterSeq = obj.sequence;
      });
      this.dataSource = new MatTableDataSource<any>(this.filterData);
    } else {
      this.filterData.push({
        sequence: this.filterSeq + 1,
        field: 'Emergency',
        criteria: 'Equals',
        value: '',
        andOr: 'And',
        isSaved: false,
      });

      this.dataSource = new MatTableDataSource<any>(this.filterData);
      this.isFilterAdd = false;
    }
  }
  onAddOrderBy(filterData?: any) {
    if (filterData) {
      filterData.map((obj) => {
        this.orderByData.push({
          id: obj.id,
          sequence: obj.sequence,
          field: obj.field,
          sortOrder: obj.order,
          isSaved: true,
        });
        this.orderBySeq = obj.sequence;
      });
      this.orderBydataSource = new MatTableDataSource<any>(this.orderByData);
    } else {
      this.orderByData.push({
        sequence: this.orderBySeq + 1,
        field: 'Emergency',
        sortOrder: 'DESC',
        isSaved: false,
      });
      this.orderBydataSource = new MatTableDataSource<any>(this.orderByData);
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
      const dialogRef: any = this.global.OpenDialog(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        autoFocus: DialogConstants.autoFocus,
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (result) {
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
      const dialogRef: any = this.global.OpenDialog(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        data: {
          savedFilter: this.savedFilter.value,
        },
        autoFocus: DialogConstants.autoFocus,
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.savedFilterList = this.savedFilterList.filter(
            (item) => item !== result.oldFilter
          );
          this.savedFilterList.push(result.newFilter);
          this.savedFilter.setValue(result.newFilter);
          const matSelect: MatSelect = option.source;
          matSelect.writeValue(null);
        });
    }
    if (option.value === 'set_default') {
      const dialogRef: any = this.global.OpenDialog(
        ConfirmationDialogComponent,
        {
          height: 'auto',
          width: '480px',
          data: {
            message: 'Mark this filter as the default one ?',
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            Description: this.savedFilter.value,
          };
          this.iInductionManagerApi
            .PickBatchDefaultFilterMark(paylaod)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.update,
                  ToasterTitle.Success
                );
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
                console.log('PickBatchDefaultFilterMark', res.responseMessage);
              }
            });
        }
        const matSelect: MatSelect = option.source;
        matSelect.writeValue(null);
      });
    }
    if (option.value === 'clear_default') {
      let paylaod = {};
      this.iInductionManagerApi
        .PickBatchDefaultFilterClear(paylaod)
        .subscribe((res) => {
          if (res.isExecuted) {
            this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
            const matSelect: MatSelect = option.source;
            matSelect.writeValue(null);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('PickBatchDefaultFilterClear', res.responseMessage);
          }
        });
    }
    if (option.value === 'view_default') {
      let paylaod = {};
      this.iInductionManagerApi
        .PickBatchDefaultFilterSelect(paylaod)
        .subscribe((res) => {
          if (res.data) {
            this.savedFilter.setValue(res.data);
            this.isFilterAdd = true;
            this.isOrderByAdd = true;
            this.filterSeq = '0';
            this.orderBySeq = '0';
            this.pickBatchFilterOrderData(res.data);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              'No filter is marked as default.',
              'Warning!'
            );
            console.log('PickBatchDefaultFilterSelect', res.responseMessage);
          }
          const matSelect: MatSelect = option.source;
          matSelect.writeValue(null);
        });
    }
    if (option.value === 'delete_selected_filter') {
      const dialogRef: any = this.global.OpenDialog(
        DeleteConfirmationComponent,
        {
          height: 'auto',
          width: '480px',
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            Description: this.savedFilter.value,
          };
          this.iInductionManagerApi
            .PickBatchFilterBatchDelete(paylaod)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.delete,
                  ToasterTitle.Success
                );
                this.savedFilterList = this.savedFilterList.filter(
                  (item) => item !== this.savedFilter.value
                );
                this.savedFilter.setValue('');
                this.savedFilClosed();
                const matSelect: MatSelect = option.source;
                matSelect.writeValue(null);
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
                console.log('PickBatchFilterBatchDelete', res.responseMessage);
              }
            });
        }
      });
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
  ordersFilterZoneSelect(zone = '', rp = false, type = '') {
    let payload;
    this.filterBatchDataZone = [];
    this.filterOrderTransactionSource = [];
    this.zoneOrderTransactionSource = [];
    if (zone == '') {
      payload = {
        Filter: this.savedFilter.value,
        Zone: '',
        BatchType: '',
        UseDefFilter: 0,
        UseDefZone: 0,
        RP: false,
      };
      this.iInductionManagerApi
        .OrdersFilterZoneSelect(payload)
        .subscribe((res) => {
          if (res.isExecuted && res.data) {
            res.data.map((val) => {
              this.filterBatchData.push({
                orderNumber: val.orderNumber,
                reqDate: val.reqDate,
                priority: val.priority,
                isSelected: false,
              });
            });
            if (this.data.allOrders.length > 0) {
              const selectedArr = this.filterBatchData.filter((element) =>
                this.data.allOrders.includes(element.orderNumber)
              );

              selectedArr.forEach((ele) => {
                ele.isSelected = true;
                this.selectedOrders.push(ele.orderNumber);
              });
              this.selectedOrders = [...new Set(this.selectedOrders)];
            }
            this.filterBatchOrders = new MatTableDataSource<any>(
              this.filterBatchData
            );
            this.filterBatchOrders.paginator = this.filterBatchOrder;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('OrdersFilterZoneSelect', res.responseMessage);
          }
        });
    } else {
      payload = {
        Filter: '',
        Zone: zone,
        BatchType: type,
        UseDefFilter: 0,
        UseDefZone: 0,
        RP: rp,
      };
      this.iInductionManagerApi
        .OrdersFilterZoneSelect(payload)
        .subscribe((res) => {
          if (res.isExecuted && res.data) {
            res.data.map((val) => {
              this.filterBatchDataZone.push({
                orderNumber: val.orderNumber,
                reqDate: val.reqDate,
                priority: val.priority,
                isSelected: false,
              });
            });
            if (this.data.allOrders.length > 0) {
              const selectedArr = this.filterBatchDataZone.filter((element) =>
                this.data.allOrders.includes(element.orderNumber)
              );

              selectedArr.forEach((ele) => {
                ele.isSelected = true;
                this.selectedOrders.push(ele.orderNumber);
              });
              this.selectedOrders = [...new Set(this.selectedOrders)];
              this.allSelectOrders = this.selectedOrders;
            }
            this.filterBatchOrdersZone = new MatTableDataSource<any>(
              this.filterBatchDataZone
            );
            this.filterBatchOrdersZone.paginator = this.zoneBatchOrder;
            this.tabIndex = 1;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('OrdersFilterZoneSelect', res.responseMessage);
          }
        });
    }
  }

  viewReplenishZoneRecord(element: any, rp: any, viewReplenish = '') {
    if (viewReplenish == '') {
      this.ordersFilterZoneSelect(element.zone, true, element.type);
    } else {
      this.ordersFilterZoneSelect(element.zone, false, element.type);
    }
  }

  onOrderSelect(row: any) {
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.filterBatchData.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.filterOrderTransactionSource = [];
          this.isOrderSelect = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(
        (item) => item !== row.orderNumber
      );
      if (this.selectedOrders.length === 0) {
        this.isOrderSelect = true;
      }
    } else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.global.ShowToastr(
        ToasterType.Error,
        'No open totes in batch',
        'Batch is Filled.'
      );
      console.log('includes');
    } else {
      this.filterBatchData.forEach((v) => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row;

      this.filterBatchData.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelect = false;
      let paylaod = {
        Draw: 0,
        OrderNumber: row.orderNumber,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: 'asc',
        Filter: '1=1',
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res) {
          this.filterOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
          this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickToteTransDT', res.responseMessage);
        }
      });
    }
  }

  onOrderSelectZone(row: any) {
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.filterBatchDataZone.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.zoneOrderTransactionSource = [];
          this.isOrderSelectZone = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(
        (item) => item !== row.orderNumber
      );

      if (this.selectedOrders.length === 0) {
        this.isOrderSelectZone = true;
      }
    } else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.global.ShowToastr(
        ToasterType.Error,
        'No open totes in batch',
        'Batch is Filled.'
      );
    } else {
      this.filterBatchDataZone.forEach((v) => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row;

      this.filterBatchDataZone.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelectZone = false;
      let paylaod = {
        Draw: 0,
        OrderNumber: row.orderNumber,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: 'asc',
        Filter: '1=1',
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res) {
          this.zoneOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
          this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickToteTransDT', res.responseMessage);
        }
      });
    }
  }
  pickBatchFilterOrderData(filter: string | null) {
    let paylaod = {
      filter: filter,
    };
    this.iInductionManagerApi
      .PickBatchFilterOrderData(paylaod)
      .subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.filterData = [];
          this.orderByData = [];
          this.pickBatchFilter = res.data.pickBatchFilter;
          this.pickBatchOrder = res.data.pickBatchOrder;
          if (!this.pickBatchFilter) {
            this.onAddFilter();
          } else {
            this.onAddFilter(this.pickBatchFilter);
          }

          if (this.pickBatchOrder) {
            this.onAddOrderBy(this.pickBatchOrder);
          }
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickBatchFilterOrderData', res.responseMessage);
        }
      });
  }
  savedFilClosed() {
    if (!this.savedFilter.value) {
      this.isFilterAdd = false;
      this.isOrderByAdd = false;
      this.filterData = [];
      this.orderByData = [];
      this.orderBydataSource = new MatTableDataSource<any>(this.orderByData);
      this.dataSource = new MatTableDataSource<any>(this.filterData);
    }
  }
  onChangeOrderAction(option: any) {
    if (option === 'fill_top_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        if (this.filterBatchData[index]) {
          this.filterBatchData[index].isSelected = true;
          this.selectedOrders.push(this.filterBatchData[index].orderNumber);
        }
      }
      this.isOrderSelect = false;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.filterBatchData.forEach((ele) => {
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
        if (this.filterBatchDataZone[index]) {
          this.filterBatchDataZone[index].isSelected = true;
          this.selectedOrders.push(this.filterBatchDataZone[index].orderNumber);
        }
      }
      this.isOrderSelectZone = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.filterBatchDataZone.forEach((ele) => {
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
      this.onCloseAllPickToteManager();
    }
    this.orderActionRefreshZone();
  }
  onViewOrderLineZone(event) {
    let orderNum = '';
    this.filterBatchDataZone.forEach((val) => {
      orderNum += val.orderNumber + ',';
    });

    if (event.value === 'vAllOrderZone') {
      let paylaod = {
        Draw: 0,
        OrderNumber: orderNum,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: 'asc',
        Filter: '1=1',
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.zoneOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
          this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickToteTransDT', res.responseMessage);
        }
      });
    }
    if (event.value === 'vSelectedOrderZone') {
      orderNum = '';
      this.filterBatchDataZone.forEach((val) => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ',';
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          Draw: 0,
          OrderNumber: orderNum,
          sRow: 1,
          eRow: 10,
          SortColumnNumber: 0,
          SortOrder: 'asc',
          Filter: '1=1',
        };
        this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.zoneOrderTransactionSource = new MatTableDataSource<any>(
              res.data.pickToteManTrans
            );
            this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
            this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('PickToteTransDT', res.responseMessage);
          }
        });
      } else {
        this.zoneOrderTransactionSource = [];
      }
    }
  }
  onViewOrderLineFilter(event) {
    let orderNum = '';
    this.filterBatchData.forEach((val) => {
      orderNum += val.orderNumber + ',';
    });

    if (event.value === 'vAllOrderFilter') {
      let paylaod = {
        Draw: 0,
        OrderNumber: orderNum ?? 'EAGLES',
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: 'asc',
        Filter: '1=1',
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.filterOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
          this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('PickToteTransDT', res.responseMessage);
        }
      });
    }
    if (event.value === 'vSelectedOrderFilter') {
      orderNum = '';
      this.filterBatchData.forEach((val) => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ',';
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          Draw: 0,
          OrderNumber: orderNum,
          sRow: 1,
          eRow: 10,
          SortColumnNumber: 0,
          SortOrder: 'asc',
          Filter: '1=1',
        };
        this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.filterOrderTransactionSource = new MatTableDataSource<any>(
              res.data.pickToteManTrans
            );
            this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
            this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('PickToteTransDT', res.responseMessage);
          }
        });
      } else {
        this.filterOrderTransactionSource = [];
      }
    }
  }

  onSaveSingleFilter(element: any) {
    if (element.value === '') {
      this.global.ShowToastr(
        ToasterType.Error,
        'Some of the inputs are missing values. Cannot add row to filter.',
        ToasterTitle.Error
      );
    } else {
      let payload = {
        Sequence: element.sequence,
        Field: element.field,
        Criteria: element.criteria,
        Value: element.value,
        AndOr: element.andOr,
        Description: this.savedFilter.value,
      };
      this.filterData.forEach((val) => {
        if (val.is_db) {
          this.iInductionManagerApi
            .PickBatchFilterUpdate(payload)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.isFilterAdd = true;
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.update,
                  ToasterTitle.Success
                );
                this.filterSeq = element.sequence;
                this.pickBatchFilterOrderData(this.savedFilter.value);
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
                console.log('PickBatchFilterUpdate', res.responseMessage);
              }
            });
        } else {
          this.iInductionManagerApi
            .PickBatchFilterInsert(payload)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.isFilterAdd = true;
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.success,
                  ToasterTitle.Success
                );
                this.filterSeq = element.sequence;
                this.pickBatchFilterOrderData(this.savedFilter.value);
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
                console.log('PickBatchFilterInsert', res.responseMessage);
              }
            });
        }
      });
    }
  }
  onSaveSingleOrder(element: any) {
    if (element.id) {
      let payload = {
        id: +element.id,
        Sequence: element.sequence,
        Field: element.field,
        Order: element.sortOrder,
        Description: this.savedFilter.value,
      };
      this.iInductionManagerApi
        .PickBatchOrderUpdate(payload)
        .subscribe((res) => {
          if (res.isExecuted) {
            this.isOrderByAdd = true;
            this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('PickBatchOrderUpdate', res.responseMessage);
          }
        });
    } else {
      let payload = {
        Sequence: element.sequence,
        Field: element.field,
        Order: element.sortOrder,
        Description: this.savedFilter.value,
      };
      this.iInductionManagerApi
        .PickBatchOrderInsert(payload)
        .subscribe((res) => {
          if (res.isExecuted) {
            this.isOrderByAdd = true;
            this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
            element.id = res.data;
            this.orderBySeq = element.sequence;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('PickBatchOrderInsert', res.responseMessage);
          }
        });
    }
    this.pickBatchFilterOrderData(this.savedFilter.value);
  }
  isUniqueSeq(element: any) {
    let res: any = [];
    this.orderBydataSource.filteredData.map((item) => {
      let existItem = res.find((x: any) => x.sequence == item.sequence);
      if (existItem) {
        this.global.ShowToastr(
          ToasterType.Error,
          "Can't have conflicting sequences within the order rows. A new sequence has been provided",
          ToasterTitle.Error
        );
        element.sequence = +existItem.sequence + 1;
      } else {
        res.push(item);
      }
    });
  }
  onDeleteSingleFilter(element: any) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let payload = {
          Sequence: element.sequence,
          Description: this.savedFilter.value,
        };
        this.iInductionManagerApi
          .PickBatchFilterDelete(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.isFilterAdd = true;
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.delete,
                ToasterTitle.Success
              );
              this.pickBatchFilterOrderData(this.savedFilter.value);
            } else {
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
              console.log('PickBatchFilterDelete', res.responseMessage);
            }
          });
      }
    });
  }
  onDeleteSingleOrder(element: any) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        ErrorMessage: 'Are you sure you want to delete this order by row?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let payload = {
          id: element.id,
        };
        this.iInductionManagerApi
          .PickBatchOrderDelete(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.isFilterAdd = true;
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.delete,
                ToasterTitle.Success
              );
              this.pickBatchFilterOrderData(this.savedFilter.value);
            } else {
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
              console.log('PickBatchOrderDelete', res.responseMessage);
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
        selectedObj = this.filterBatchData.filter((element) =>
          this.allSelectOrders.includes(element.orderNumber)
        );
        selectedObj = [
          ...new Map(
            selectedObj.map((item) => [item.orderNumber, item])
          ).values(),
        ];

        let orderNumbers = new Set(selectedObj.map((d) => d.orderNumber));
        currentObjArr = [
          ...selectedObj,
          ...this.data.resultObj.filter(
            (d) => !orderNumbers.has(d.orderNumber)
          ),
        ];
      }
    } else if (this.allSelectOrders.length > 0) {
      selectedObj = this.filterBatchDataZone.filter((element) =>
        this.allSelectOrders.includes(element.orderNumber)
      );
      selectedObj = [
        ...new Map(
          selectedObj.map((item) => [item.orderNumber, item])
        ).values(),
      ];

      let orderNumbers = new Set(selectedObj.map((d) => d.orderNumber));
      currentObjArr = [
        ...selectedObj,
        ...this.data.resultObj.filter((d) => !orderNumbers.has(d.orderNumber)),
      ];
    }
    this.dialogRef.close(currentObjArr);
  }

  onCloseAllPickToteManager() {
    this.allSelectOrders = this.selectedOrders;
  }

  onSelectBatchZone(row) {
    const dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '480px',
      data: {
        message: 'Mark this filter as a default one ?',
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let payload = {
          zone: row.zone,
          type: row.type,
        };
        this.iInductionManagerApi
          .PickBatchZoneDefaultMark(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.update,
                ToasterTitle.Success
              );
            } else {
              this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
              console.log('PickBatchZoneDefaultMark', res.responseMessage);
            }
          });
      }
    });
  }
}
