import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { AuthService } from '../../common/init/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  TableConstant ,Column,zoneType,ToasterTitle,ToasterType,ColumnDef,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  displayedColumns: string[] = [UniqueConstants.position, 'toteid', 'orderno', 'priority', 'options', 'other'];

  displayedColumns1: string[] = [UniqueConstants.position, 'toteid', 'orderno', 'other'];

  displayedColumns2: string[] = ['orderno'];

  displayedColumns3: string[] = ['orderno', 'itemno', 'transaction', 'location', 'completed'];
  public userData: any;
  allOrders: any[] = [];
  selectedOrders: any[] = [];
  orderDataSource: any;
  selectedTd: any;
  isDisableSubmit: boolean = true
  transData: any;

  filterTransColumns = [
    { columnDef: 'orderNumber', header: Column.OrderNumber, cell: (element: any) => `${element.orderNumber}` },
    { columnDef: 'itemNumber', header: Column.ItemNumber, cell: (element: any) => `${element.itemNumber}` },
    { columnDef: 'transactionQuantity', header: 'Transaction Quantity', cell: (element: any) => `${element.transactionQuantity}` },
    { columnDef: 'location', header: Column.Location, cell: (element: any) => `${element.location}` },
    { columnDef: 'completedQuantity', header: 'Completed Quantity', cell: (element: any) => `${element.completedQuantity}` },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element.description}` },
    { columnDef: 'batchPickID', header: 'Batch Pick ID', cell: (element: any) => `${element.batchPickID}` },
    { columnDef: 'bin', header: 'Bin', cell: (element: any) => `${element.bin}` },
    { columnDef: zoneType.carousel, header: 'Carousel', cell: (element: any) => `${element.carousel}` },
    { columnDef: 'cell', header: TableConstant.Cell, cell: (element: any) => `${element.cell}` },
    { columnDef: 'completedBy', header: 'Completed By', cell: (element: any) => `${element.completedBy}` },
    { columnDef: 'completedDate', header: TableConstant.CompletedDate, cell: (element: any) => `${element.completedDate}` },
    { columnDef: 'emergency', header: 'Emergency', cell: (element: any) => `${element.emergency}` },
    { columnDef: 'expirationDate', header: TableConstant.ExpirationDate, cell: (element: any) => `${element.expirationDate}` },
    { columnDef: 'exportBatchID', header: 'Export Batch ID', cell: (element: any) => `${element.exportBatchID}` },
    { columnDef: 'exportDate', header: 'Export Date', cell: (element: any) => `${element.exportDate}` },
    { columnDef: 'exportedBy', header: 'Exported By', cell: (element: any) => `${element.exportedBy}` },
    { columnDef: 'hostTransactionID', header: TableConstant.HostTransactionID, cell: (element: any) => `${element.hostTransactionID}` },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    { columnDef: TableConstant.ImportBy, header: 'Import By', cell: (element: any) => `${element.importBy}` },
    { columnDef: 'importDate', header: 'Import Date', cell: (element: any) => `${element.importDate}` },
    { columnDef: 'importFilename', header: 'Import Filename', cell: (element: any) => `${element.importFilename}` },
    { columnDef: 'invMapID', header: 'Inventory Map ID', cell: (element: any) => `${element.invMapID}` },
    { columnDef: 'lineNumber', header: 'Line Number', cell: (element: any) => `${element.lineNumber}` },
    { columnDef: TableConstant.LineSequence, header: 'Line Sequence', cell: (element: any) => `${element.lineSequence}` },
    { columnDef: 'lotNumber', header: Column.LotNumber, cell: (element: any) => `${element.lotNumber}` },
    { columnDef: 'masterRecord', header: 'Master Record', cell: (element: any) => `${element.masterRecord}` },
    { columnDef: 'masterRecordID', header: 'Master Record ID', cell: (element: any) => `${element.masterRecordID}` },
    { columnDef: 'notes', header: 'Notes', cell: (element: any) => `${element.notes}` },
    { columnDef: 'priority', header: 'Priority', cell: (element: any) => `${element.priority}` },
    { columnDef: 'requiredDate', header: 'Required Date', cell: (element: any) => `${element.requiredDate}` },
    { columnDef: 'revision', header: TableConstant.Revision, cell: (element: any) => `${element.revision}` },
    { columnDef: 'row', header: 'Row', cell: (element: any) => `${element.row}` },
    { columnDef: 'serialNumber', header: 'Serial Number', cell: (element: any) => `${element.serialNumber}` },
    { columnDef: 'shelf', header: 'Shelf', cell: (element: any) => `${element.shelf}` },
    { columnDef: 'statusCode', header: 'Status Code', cell: (element: any) => `${element.statusCode}` },
    { columnDef: 'toteID', header: Column.ToteID, cell: (element: any) => `${element.toteID}` },
    { columnDef: 'toteNumber', header: 'Tote Number', cell: (element: any) => `${element.toteNumber}` },
    { columnDef: 'unitOfMeasure', header: 'Unit Of Measure', cell: (element: any) => `${element.unitOfMeasure}` },
    { columnDef: ColumnDef.userField1, header: TableConstant.UserField1, cell: (element: any) => `${element.userField1}` },
    { columnDef: ColumnDef.userField2, header: TableConstant.UserField2, cell: (element: any) => `${element.userField2}` },
    { columnDef: ColumnDef.userField3, header: 'User Field3', cell: (element: any) => `${element.userField3}` },
    { columnDef: ColumnDef.userField4, header: 'User Field4', cell: (element: any) => `${element.userField4}` },
    { columnDef: ColumnDef.userField5, header: 'User Field5', cell: (element: any) => `${element.userField5}` },
    { columnDef: ColumnDef.userField6, header: 'User Field6', cell: (element: any) => `${element.userField6}` },
    { columnDef: ColumnDef.userField7, header: 'User Field7', cell: (element: any) => `${element.userField7}` },
    { columnDef: ColumnDef.userField8, header: 'User Field8', cell: (element: any) => `${element.userField8}` },
    { columnDef: ColumnDef.userField9, header: 'User Field9', cell: (element: any) => `${element.userField9}` },
    { columnDef: ColumnDef.userField10, header: 'User Field10', cell: (element: any) => `${element.userField10}` },
    { columnDef: 'warehouse', header: 'Warehouse', cell: (element: any) => `${element.warehouse}` },
    { columnDef: 'zone', header: 'Zone', cell: (element: any) => `${element.zone}` },
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
            
            selectedArr.forEach(ele => {
              ele.isSelected = true
              this.selectedOrders.push(ele.orderNumber);
            });
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
    if (option === 'fill_top_orders') {
      this.selectedOrders = [];
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        this.allOrders[index].isSelected = true;
        this.selectedOrders.push(this.allOrders[index].orderNumber);
      }
    }
    if (option === 'unselect_all_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        this.allOrders[index].isSelected = false;
        this.selectedOrders = [];
      }
    }
  }

  ngAfterViewInit() {
    this.orderDataSource.paginator = this.paginator;
    this.orderTransDataSource.paginator = this.paginatorTrans;
  }

  onOrderSelect(row: any) {
    
    
    
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.allOrders.forEach(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.orderTransDataSource = [];
        }
      });
      this.selectedOrders = this.selectedOrders.filter(item => item !== row.orderNumber)
    }
    else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.global.ShowToastr(ToasterType.Error,'No open totes in batch', 'Batch is Filled.');
    }
    else {
      this.selectedOrders.push(row.orderNumber);
      this.allOrders.forEach(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      let paylaod = {
        "Draw": 0,
        "OrderNumber": row.orderNumber,
        "sRow": 1,
        "eRow": 10,
        "SortColumnNumber": 0,
        "SortOrder": "asc",
        "Filter": "1=1", 
      }
      this.iInductionManagerApi.InZoneTransDT(paylaod).subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.transData = res.data.pickToteManTrans;
          this.orderTransDataSource = new MatTableDataSource<any>(this.transData);
          this.orderTransDataSource.paginator = this.paginatorTrans;
          this.orderTransDataSource.sort = this.viewTransSort;
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("InZoneTransDT",res.responseMessage);

        }
      });
    }



  }
  onSelectedOrders() {
    this.dialogRef.close(this.selectedOrders);
  }

}
