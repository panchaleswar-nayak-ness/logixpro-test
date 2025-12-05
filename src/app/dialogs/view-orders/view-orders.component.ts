import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { AuthService } from '../../common/init/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRadioChange } from '@angular/material/radio'; 
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { DateFormats, GlobalService } from 'src/app/common/services/global.service';
import {  TableConstant ,Column,zoneType,ToasterTitle,ToasterType,ColumnDef,UniqueConstants,OrderActions} from 'src/app/common/constants/strings.constants';
import { TransactionData } from 'src/app/common/interface/view-orders-dialog/transaction-data.interface';
import { cleanData, safeCellValue } from 'src/app/common/CommonHelpers/data-utils.helper';
import { PaginationData } from 'src/app/common/enums/CommonEnums';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss'],
  providers: [DatePipe]
})
export class ViewOrdersComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  UnitOfMeasure: string = this.fieldMappings.unitOfMeasure;
  UserField1:string = this.fieldMappings.userField1;
  UserField2:string = this.fieldMappings.userField2;
  UserField3:string = this.fieldMappings.userField3;
  UserField4:string = this.fieldMappings.userField4;
  UserField5:string = this.fieldMappings.userField5;
  UserField6:string = this.fieldMappings.userField6;
  UserField7:string = this.fieldMappings.userField7;
  UserField8:string = this.fieldMappings.userField8;
  UserField9:string = this.fieldMappings.userField9;
  UserField10:string = this.fieldMappings.userField10;

  displayedColumns: string[] = [UniqueConstants.position, 'toteid', 'orderno', UniqueConstants.Priority, 'options', 'other'];

  displayedColumns1: string[] = [UniqueConstants.position, 'toteid', 'orderno', 'other'];

  displayedColumns2: string[] = ['orderno', 'requireddate', 'transactionsline', 'priority'];

  displayedColumns3: string[] = ['orderno', 'itemno', 'transaction', TableConstant.Location, 'completed'];
  public userData: any;
  allOrders: any[] = [];
  selectedOrders: any[] = [];
  orderDataSource: any;
  selectedTd: any;
  isDisableSubmit: boolean = true
  transData: TransactionData[];
  isMultiSelectMode: boolean = false;
  totalTransactionRecords: number = 0;
  isViewAllOrderLines: boolean = false;

  filterTransColumns = [
    { columnDef: 'orderNumber', header: Column.OrderNumber, cell: (element: TransactionData) => `${element.orderNumber}` },
    { columnDef: 'itemNumber', header: this.ItemNumber, cell: (element: TransactionData) => `${element.itemNumber}` },
    { columnDef: ColumnDef.TransactionQuantity, header: TableConstant.TransactionQuantity, cell: (element: TransactionData) => `${element.transactionQuantity}` },
    { columnDef: TableConstant.Location, header: Column.Location, cell: (element: TransactionData) => `${element.location}` },
    { columnDef: TableConstant.completedQuantity, header: 'Completed Quantity', cell: (element: TransactionData) => `${element.completedQuantity}` },
    { columnDef: UniqueConstants.Description, header: Column.Description, cell: (element: TransactionData) => `${element.description}` },
    { columnDef: TableConstant.BatchPickID, header: ColumnDef.BatchPickID, cell: (element: TransactionData) => safeCellValue(element.batchPickId) },
    { columnDef: ColumnDef.Bin, header: this.fieldMappings?.bin || TableConstant.Bin, cell: (element: TransactionData) => `${element.bin}` },
    { columnDef: zoneType.carousel, header: this.fieldMappings?.carousel || TableConstant.Carousel, cell: (element: TransactionData) => `${element.carousel}` },
    { columnDef: Column.cell, header: TableConstant.Cell, cell: (element: TransactionData) => `${element.cell}` },
    { columnDef: 'completedBy', header: 'Completed By', cell: (element: TransactionData) => `${element.completedBy}` },
    { columnDef: 'completedDate', header: TableConstant.CompletedDate, cell: (element: TransactionData) => `${element.completedDate}` },
    { columnDef: UniqueConstants.emergency, header: ColumnDef.Emergency, cell: (element: TransactionData) => `${element.emergency}` },
    { columnDef: ColumnDef.ExpirationDate, header: TableConstant.ExpirationDate, cell: (element: TransactionData) => this.datePipe.transform(element.expirationDate, DateFormats.DateTimeWithMilliseconds) || `${element.expirationDate}` },
    { columnDef: 'exportBatchID', header: 'Export Batch ID', cell: (element: TransactionData) => safeCellValue(element.exportBatchId) },
    { columnDef: 'exportDate', header: 'Export Date', cell: (element: TransactionData) => `${element.exportDate}` },
    { columnDef: 'exportedBy', header: 'Exported By', cell: (element: TransactionData) => `${element.exportedBy}` },
    { columnDef: ColumnDef.HostTransactionId, header: TableConstant.HostTransactionID, cell: (element: TransactionData) => safeCellValue(element.hostTransactionId) },
    { columnDef: 'id', header: 'ID', cell: (element: TransactionData) => `${element.id}` },
    { columnDef: TableConstant.ImportBy, header: 'Import By', cell: (element: TransactionData) => `${element.importBy}` },
    { columnDef: TableConstant.ImportDate, header: 'Import Date', cell: (element: TransactionData) => `${element.importDate}` },
    { columnDef: 'importFilename', header: 'Import Filename', cell: (element: TransactionData) => `${element.importFilename}` },
    { columnDef: 'invMapID', header: 'Inventory Map ID', cell: (element: TransactionData) => safeCellValue(element.invMapId) },
    { columnDef: TableConstant.LineNumber, header: 'Line Number', cell: (element: TransactionData) => `${element.lineNumber}` },
    { columnDef: TableConstant.LineSequence, header: 'Line Sequence', cell: (element: TransactionData) => `${element.lineSequence}` },
    { columnDef: TableConstant.LotNumber, header: Column.LotNumber, cell: (element: TransactionData) => `${element.lotNumber}` },
    { columnDef: 'masterRecord', header: 'Master Record', cell: (element: TransactionData) => `${element.masterRecord}` },
    { columnDef: 'masterRecordID', header: 'Master Record ID', cell: (element: TransactionData) => safeCellValue(element.masterRecordId) },
    { columnDef: TableConstant.Notes, header: 'Notes', cell: (element: TransactionData) => `${element.notes}` },
    { columnDef: UniqueConstants.Priority, header: 'Priority', cell: (element: TransactionData) => `${element.priority}` },
    { columnDef: ColumnDef.RequiredDate, header: 'Required Date', cell: (element: TransactionData) => `${element.requiredDate}` },
    { columnDef: ColumnDef.Revision, header: TableConstant.Revision, cell: (element: TransactionData) => `${element.revision}` },
    { columnDef: Column.Row, header: this.fieldMappings?.row || TableConstant.Row, cell: (element: TransactionData) => `${element.row}` },
    { columnDef: TableConstant.SerialNumber, header: ColumnDef.SerialNumber, cell: (element: TransactionData) => `${element.serialNumber}` },
    { columnDef: TableConstant.shelf, header: this.fieldMappings?.shelf || TableConstant.shelf, cell: (element: TransactionData) => `${element.shelf}` },
    { columnDef: 'statusCode', header: 'Status Code', cell: (element: TransactionData) => `${element.statusCode}` },
    { columnDef: ColumnDef.ToteID, header: Column.ToteID, cell: (element: TransactionData) => safeCellValue(element.toteId) },
    { columnDef: 'toteNumber', header: 'Tote Number', cell: (element: TransactionData) => `${element.toteNumber}` },
    { columnDef: ColumnDef.UnitOfMeasure, header: this.UnitOfMeasure, cell: (element: TransactionData) => `${element.unitOfMeasure}` },
    { columnDef: ColumnDef.userField1, header: this.UserField1, cell: (element: TransactionData) => `${element.userField1}` },
    { columnDef: ColumnDef.userField2, header: this.UserField2, cell: (element: TransactionData) => `${element.userField2}` },
    { columnDef: ColumnDef.userField3, header: this.UserField3, cell: (element: TransactionData) => `${element.userField3}` },
    { columnDef: ColumnDef.userField4, header: this.UserField4, cell: (element: TransactionData) => `${element.userField4}` },
    { columnDef: ColumnDef.userField5, header: this.UserField5, cell: (element: TransactionData) => `${element.userField5}` },
    { columnDef: ColumnDef.userField6, header: this.UserField6, cell: (element: TransactionData) => `${element.userField6}` },
    { columnDef: ColumnDef.userField7, header: this.UserField7, cell: (element: TransactionData) => `${element.userField7}` },
    { columnDef: ColumnDef.userField8, header: this.UserField8, cell: (element: TransactionData) => `${element.userField8}` },
    { columnDef: ColumnDef.userField9, header: this.UserField9, cell: (element: TransactionData) => `${element.userField9}` },
    { columnDef: ColumnDef.userField10, header: this.UserField10, cell: (element: TransactionData) => `${element.userField10}` },
    { columnDef: TableConstant.WareHouse, header: ColumnDef.Warehouse, cell: (element: TransactionData) => `${element.warehouse}` },
    { columnDef: TableConstant.zone, header: ColumnDef.Zone, cell: (element: TransactionData) => `${element.zone}` },
  ];

  displayedTransColumns = this.filterTransColumns.map(c => c.columnDef);

  orderTransDataSource: MatTableDataSource<TransactionData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorTrans') paginatorTrans: MatPaginator;
  @ViewChild(MatSort) viewTransSort: MatSort;
  public iInductionManagerApi:IInductionManagerApiService;

  constructor( 
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public dialogRef: MatDialogRef<ViewOrdersComponent>,
    private datePipe: DatePipe
  ) { 
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getAllOrders();
    

  }

  getAllOrders() {
    let paylaod = {
      "OrderView": this.data.viewType, 
    }
    this.iInductionManagerApi.OrdersInZone(paylaod).subscribe((res) => {
      if (res && res.isSuccess && res.value && Array.isArray(res.value))
      {
        if (res.value.length > 0) {
          res.value.forEach(val => {
            this.allOrders.push({
              orderNumber: val.orderNumber || '',
              reqDate: val.requiredDate || '',
              priority: val.priority || '',
              otLines: val.totalLine || '',
              isSelected: false
            });
          });
          if (this.data.allOrders.length > 0) {
            const selectedArr = this.allOrders.filter(element => this.data.allOrders.includes(element.orderNumber));
            
            // Only select the first order for single-select mode
            if (selectedArr.length > 0) {
              selectedArr[0].isSelected = true;
              this.selectedOrders = [selectedArr[0].orderNumber];
            }
          }
  
          this.orderDataSource = new MatTableDataSource<any>(this.allOrders);
          this.orderDataSource.paginator = this.paginator;
          this.isDisableSubmit = false;
  
        }
        else{
          this.global.ShowToastr(ToasterType.Error,'There are no orders for your zone', ToasterTitle.Error);
          this.isDisableSubmit = true
          
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("OrdersInZone - Invalid response", res);
      }
      
      
    });
  }
  onChangeOrderAction(option: any) {
    if (option === OrderActions.SelectOrder) {
      // Enable multi-select mode
      this.isMultiSelectMode = true;
    }
    if (option === OrderActions.SelectAllOrders) {
      this.isMultiSelectMode = false;
      
      // Get indices of positions with ToteIDs filled
      const toteIndices: number[] = [];
      if (this.data.toteSetup && Array.isArray(this.data.toteSetup)) {
        this.data.toteSetup.forEach((tote, index) => {
          if (tote.toteID && tote.toteID !== '') {
            toteIndices.push(index);
          }
        });
      }
      
      // Select orders only at indices where ToteIDs exist
      this.allOrders.forEach((val, index) => {
        if (toteIndices.length > 0) {
          // Only select if this index has a corresponding ToteID
          val.isSelected = toteIndices.includes(index);
        } else {
          // If no tote setup data, select all
          val.isSelected = true;
        }
      });
      
      this.selectedOrders = this.allOrders
        .filter(val => val.isSelected)
        .map(val => val.orderNumber);
    }
    if (option === OrderActions.UnselectAllOrders) {
      this.isMultiSelectMode = false;
      this.deselectAllOrders();
      this.selectedOrders = [];
      this.orderTransDataSource = new MatTableDataSource<TransactionData>([]);
      this.totalTransactionRecords = 0;
    }
  }

  ngAfterViewInit() {
    this.orderDataSource.paginator = this.paginator;
    this.orderTransDataSource.paginator = this.paginatorTrans;
  }

  onOrderSelect(row: any) {
    if (this.isMultiSelectMode) {
      // Multi-select mode: Toggle the clicked order
      if (this.selectedOrders.includes(row.orderNumber)) {
        // Deselect the order
        this.allOrders.forEach(val => {
          if (val.orderNumber === row.orderNumber) {
            val.isSelected = false;
          }
        });
        this.selectedOrders = this.selectedOrders.filter(orderNum => orderNum !== row.orderNumber);
        
        // Clear transactions if no orders selected
        if (this.selectedOrders.length === 0) {
          this.orderTransDataSource = new MatTableDataSource<TransactionData>([]);
          this.totalTransactionRecords = 0;
        }
      }
      else {
        // Select the order (add to existing selection)
        this.allOrders.forEach(val => {
          if (val.orderNumber === row.orderNumber) {
            val.isSelected = true;
          }
        });
        this.selectedOrders.push(row.orderNumber);
      }
    }
    else {
      // Single-select mode (default behavior)
      // If clicking the same order that's already selected, deselect it
      if (this.selectedOrders.includes(row.orderNumber)) {
        this.allOrders.forEach(val => {
          if (val.orderNumber === row.orderNumber) {
            val.isSelected = false;
          }
        });
        this.selectedOrders = [];
        this.orderTransDataSource = new MatTableDataSource<TransactionData>([]);
        this.totalTransactionRecords = 0;
      }
      else {
        // Deselect all previously selected orders
        this.deselectAllOrders();
        
        // Select only the new order
        this.selectedOrders = [row.orderNumber];
        this.allOrders.forEach(val => {
          if (val.orderNumber === row.orderNumber) {
            val.isSelected = true;
          }
        });
        
        // Fetch transactions for the selected order (single order, not "view all")
        this.isViewAllOrderLines = false;
        this.fetchOrderTransactions(row.orderNumber);
      }
    }
  }
  onSelectedOrders() {
    this.dialogRef.close(this.selectedOrders);
  }

  private deselectAllOrders(): void {
    this.allOrders.forEach(val => {
      val.isSelected = false;
    });
  }

  private fetchOrderTransactions(orderNumber: string): void {
    if (!orderNumber) {
      this.orderTransDataSource = new MatTableDataSource<TransactionData>([]);
      this.totalTransactionRecords = 0;
      return;
    }

    let paylaod = {
      "Draw": PaginationData.Draw,
      "OrderNumber": orderNumber,
      "sRow": PaginationData.StartRow,
      "eRow": this.isViewAllOrderLines ? PaginationData.Max : PaginationData.EndRow,
      "SortColumnNumber": 0,
      "SortOrder": UniqueConstants.Asc,
      "Filter": "1=1", 
    }
    this.iInductionManagerApi.InZoneTransDT(paylaod).subscribe((res) => {
      if (res.isSuccess && res.value) {
        this.transData = cleanData(res.value.transactions as TransactionData[]);
        this.totalTransactionRecords = this.transData.length;
        this.orderTransDataSource = new MatTableDataSource<TransactionData>(this.transData);
        this.orderTransDataSource.paginator = this.paginatorTrans;
        this.orderTransDataSource.sort = this.viewTransSort;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }

  onViewOrderLineFilter(event: MatRadioChange) {
    if (event.value === 'vAllOrderFilter') {
      this.fetchOrdersByFilter(true);
    }
    else if (event.value === 'vSelectedOrderFilter') {
      this.fetchOrdersByFilter(false);
    }
  }

  private fetchOrdersByFilter(viewAll: boolean): void {
    this.isViewAllOrderLines = viewAll;
    let orderNum = '';
    this.allOrders.forEach((val) => {
      if (viewAll || val.isSelected) {
        orderNum += val.orderNumber + ',';
      }
    });
    this.fetchOrderTransactions(orderNum);
  }

}
