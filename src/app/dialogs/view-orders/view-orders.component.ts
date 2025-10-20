import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { AuthService } from '../../common/init/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  TableConstant ,Column,zoneType,ToasterTitle,ToasterType,ColumnDef,UniqueConstants,OrderActions} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
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

  displayedColumns2: string[] = ['orderno'];

  displayedColumns3: string[] = ['orderno', 'itemno', 'transaction', TableConstant.Location, 'completed'];
  public userData: any;
  allOrders: any[] = [];
  selectedOrders: any[] = [];
  orderDataSource: any;
  selectedTd: any;
  isDisableSubmit: boolean = true
  transData: any;

  filterTransColumns = [
    { columnDef: 'orderNumber', header: Column.OrderNumber, cell: (element: any) => `${element.orderNumber}` },
    { columnDef: 'itemNumber', header: this.ItemNumber, cell: (element: any) => `${element.itemNumber}` },
    { columnDef: ColumnDef.TransactionQuantity, header: TableConstant.TransactionQuantity, cell: (element: any) => `${element.transactionQuantity}` },
    { columnDef: TableConstant.Location, header: Column.Location, cell: (element: any) => `${element.location}` },
    { columnDef: TableConstant.completedQuantity, header: 'Completed Quantity', cell: (element: any) => `${element.completedQuantity}` },
    { columnDef: UniqueConstants.Description, header: Column.Description, cell: (element: any) => `${element.description}` },
    { columnDef: TableConstant.BatchPickID, header: ColumnDef.BatchPickID, cell: (element: any) => `${element.batchPickID}` },
    { columnDef: ColumnDef.Bin, header: this.fieldMappings?.bin || TableConstant.Bin, cell: (element: any) => `${element.bin}` },
    { columnDef: zoneType.carousel, header: this.fieldMappings?.carousel || TableConstant.Carousel, cell: (element: any) => `${element.carousel}` },
    { columnDef: Column.cell, header: TableConstant.Cell, cell: (element: any) => `${element.cell}` },
    { columnDef: 'completedBy', header: 'Completed By', cell: (element: any) => `${element.completedBy}` },
    { columnDef: 'completedDate', header: TableConstant.CompletedDate, cell: (element: any) => `${element.completedDate}` },
    { columnDef: UniqueConstants.emergency, header: ColumnDef.Emergency, cell: (element: any) => `${element.emergency}` },
    { columnDef: ColumnDef.ExpirationDate, header: TableConstant.ExpirationDate, cell: (element: any) => `${element.expirationDate}` },
    { columnDef: 'exportBatchID', header: 'Export Batch ID', cell: (element: any) => `${element.exportBatchID}` },
    { columnDef: 'exportDate', header: 'Export Date', cell: (element: any) => `${element.exportDate}` },
    { columnDef: 'exportedBy', header: 'Exported By', cell: (element: any) => `${element.exportedBy}` },
    { columnDef: ColumnDef.HostTransactionId, header: TableConstant.HostTransactionID, cell: (element: any) => `${element.hostTransactionID}` },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    { columnDef: TableConstant.ImportBy, header: 'Import By', cell: (element: any) => `${element.importBy}` },
    { columnDef: TableConstant.ImportDate, header: 'Import Date', cell: (element: any) => `${element.importDate}` },
    { columnDef: 'importFilename', header: 'Import Filename', cell: (element: any) => `${element.importFilename}` },
    { columnDef: 'invMapID', header: 'Inventory Map ID', cell: (element: any) => `${element.invMapID}` },
    { columnDef: TableConstant.LineNumber, header: 'Line Number', cell: (element: any) => `${element.lineNumber}` },
    { columnDef: TableConstant.LineSequence, header: 'Line Sequence', cell: (element: any) => `${element.lineSequence}` },
    { columnDef: TableConstant.LotNumber, header: Column.LotNumber, cell: (element: any) => `${element.lotNumber}` },
    { columnDef: 'masterRecord', header: 'Master Record', cell: (element: any) => `${element.masterRecord}` },
    { columnDef: 'masterRecordID', header: 'Master Record ID', cell: (element: any) => `${element.masterRecordID}` },
    { columnDef: TableConstant.Notes, header: 'Notes', cell: (element: any) => `${element.notes}` },
    { columnDef: UniqueConstants.Priority, header: 'Priority', cell: (element: any) => `${element.priority}` },
    { columnDef: ColumnDef.RequiredDate, header: 'Required Date', cell: (element: any) => `${element.requiredDate}` },
    { columnDef: ColumnDef.Revision, header: TableConstant.Revision, cell: (element: any) => `${element.revision}` },
    { columnDef: Column.Row, header: this.fieldMappings?.row || TableConstant.Row, cell: (element: any) => `${element.row}` },
    { columnDef: TableConstant.SerialNumber, header: ColumnDef.SerialNumber, cell: (element: any) => `${element.serialNumber}` },
    { columnDef: TableConstant.shelf, header: this.fieldMappings?.shelf || TableConstant.shelf, cell: (element: any) => `${element.shelf}` },
    { columnDef: 'statusCode', header: 'Status Code', cell: (element: any) => `${element.statusCode}` },
    { columnDef: ColumnDef.ToteID, header: Column.ToteID, cell: (element: any) => `${element.toteID}` },
    { columnDef: 'toteNumber', header: 'Tote Number', cell: (element: any) => `${element.toteNumber}` },
    { columnDef: ColumnDef.UnitOfMeasure, header: this.UnitOfMeasure, cell: (element: any) => `${element.unitOfMeasure}` },
    { columnDef: ColumnDef.userField1, header: this.UserField1, cell: (element: any) => `${element.userField1}` },
    { columnDef: ColumnDef.userField2, header: this.UserField2, cell: (element: any) => `${element.userField2}` },
    { columnDef: ColumnDef.userField3, header: this.UserField3, cell: (element: any) => `${element.userField3}` },
    { columnDef: ColumnDef.userField4, header: this.UserField4, cell: (element: any) => `${element.userField4}` },
    { columnDef: ColumnDef.userField5, header: this.UserField5, cell: (element: any) => `${element.userField5}` },
    { columnDef: ColumnDef.userField6, header: this.UserField6, cell: (element: any) => `${element.userField6}` },
    { columnDef: ColumnDef.userField7, header: this.UserField7, cell: (element: any) => `${element.userField7}` },
    { columnDef: ColumnDef.userField8, header: this.UserField8, cell: (element: any) => `${element.userField8}` },
    { columnDef: ColumnDef.userField9, header: this.UserField9, cell: (element: any) => `${element.userField9}` },
    { columnDef: ColumnDef.userField10, header: this.UserField10, cell: (element: any) => `${element.userField10}` },
    { columnDef: TableConstant.WareHouse, header: ColumnDef.Warehouse, cell: (element: any) => `${element.warehouse}` },
    { columnDef: TableConstant.zone, header: ColumnDef.Zone, cell: (element: any) => `${element.zone}` },
  ];

  displayedTransColumns = this.filterTransColumns.map(c => c.columnDef);

  orderTransDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorTrans') paginatorTrans: MatPaginator;
  @ViewChild(MatSort) viewTransSort: MatSort;
  public iInductionManagerApi:IInductionManagerApiService;

  constructor( 
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public dialogRef: MatDialogRef<any>
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
      if (res.isExecuted && res.data)
      {
        if (res.data.length > 0) {
          res.data.map(val => {
            this.allOrders.push({ 'orderNumber': val, isSelected: false });
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
        console.log("OrdersInZone",res.responseMessage);
      }
      
      
    });
  }
  onChangeOrderAction(option: any) {
    if (option === OrderActions.SelectFirstOrder) {
      // Deselect all orders first
      this.deselectAllOrders();
      
      // Select only the first order
      if (this.allOrders.length > 0) {
        this.allOrders[0].isSelected = true;
        this.selectedOrders = [this.allOrders[0].orderNumber];
      }
    }
    if (option === OrderActions.UnselectOrder) {
      this.deselectAllOrders();
      this.selectedOrders = [];
      this.orderTransDataSource = [];
    }
  }

  ngAfterViewInit() {
    this.orderDataSource.paginator = this.paginator;
    this.orderTransDataSource.paginator = this.paginatorTrans;
  }

  onOrderSelect(row: any) {
    // If clicking the same order that's already selected, deselect it
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.allOrders.forEach(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
        }
      });
      this.selectedOrders = [];
      this.orderTransDataSource = [];
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
      
      // Fetch transactions for the selected order
      let paylaod = {
        "Draw": 0,
        "OrderNumber": row.orderNumber,
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": UniqueConstants.Asc,
        "Filter": "1=1", 
      }
      this.iInductionManagerApi.InZoneTransDT(paylaod).subscribe((res) => {
        if (res.isSuccess && res.value) {
          this.transData = res.value.transactions;
          this.orderTransDataSource = new MatTableDataSource<any>(this.transData);
          this.orderTransDataSource.paginator = this.paginatorTrans;
          this.orderTransDataSource.sort = this.viewTransSort;
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        }
      });
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

}
