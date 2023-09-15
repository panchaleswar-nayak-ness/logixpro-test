// import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../app/init/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  displayedColumns: string[] = ['position', 'toteid', 'orderno', 'priority', 'options', 'other'];

  displayedColumns1: string[] = ['position', 'toteid', 'orderno', 'other'];

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
    { columnDef: 'orderNumber', header: 'Order Number', cell: (element: any) => `${element.orderNumber}` },
    { columnDef: 'itemNumber', header: 'Item Number', cell: (element: any) => `${element.itemNumber}` },
    { columnDef: 'transactionQuantity', header: 'Transaction Quantity', cell: (element: any) => `${element.transactionQuantity}` },
    { columnDef: 'location', header: 'Location', cell: (element: any) => `${element.location}` },
    { columnDef: 'completedQuantity', header: 'Completed Quantity', cell: (element: any) => `${element.completedQuantity}` },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element.description}` },
    { columnDef: 'batchPickID', header: 'Batch Pick ID', cell: (element: any) => `${element.batchPickID}` },
    { columnDef: 'bin', header: 'Bin', cell: (element: any) => `${element.bin}` },
    { columnDef: 'carousel', header: 'Carousel', cell: (element: any) => `${element.carousel}` },
    { columnDef: 'cell', header: 'Cell', cell: (element: any) => `${element.cell}` },
    { columnDef: 'completedBy', header: 'Completed By', cell: (element: any) => `${element.completedBy}` },
    { columnDef: 'completedDate', header: 'Completed Date', cell: (element: any) => `${element.completedDate}` },
    { columnDef: 'emergency', header: 'Emergency', cell: (element: any) => `${element.emergency}` },
    { columnDef: 'expirationDate', header: 'Expiration Date', cell: (element: any) => `${element.expirationDate}` },
    { columnDef: 'exportBatchID', header: 'Export Batch ID', cell: (element: any) => `${element.exportBatchID}` },
    { columnDef: 'exportDate', header: 'Export Date', cell: (element: any) => `${element.exportDate}` },
    { columnDef: 'exportedBy', header: 'Exported By', cell: (element: any) => `${element.exportedBy}` },
    { columnDef: 'hostTransactionID', header: 'Host Transaction ID', cell: (element: any) => `${element.hostTransactionID}` },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    { columnDef: 'importBy', header: 'Import By', cell: (element: any) => `${element.importBy}` },
    { columnDef: 'importDate', header: 'Import Date', cell: (element: any) => `${element.importDate}` },
    { columnDef: 'importFilename', header: 'Import Filename', cell: (element: any) => `${element.importFilename}` },
    { columnDef: 'invMapID', header: 'Inventory Map ID', cell: (element: any) => `${element.invMapID}` },
    { columnDef: 'lineNumber', header: 'Line Number', cell: (element: any) => `${element.lineNumber}` },
    { columnDef: 'lineSequence', header: 'Line Sequence', cell: (element: any) => `${element.lineSequence}` },
    { columnDef: 'lotNumber', header: 'Lot Number', cell: (element: any) => `${element.lotNumber}` },
    { columnDef: 'masterRecord', header: 'Master Record', cell: (element: any) => `${element.masterRecord}` },
    { columnDef: 'masterRecordID', header: 'Master Record ID', cell: (element: any) => `${element.masterRecordID}` },
    { columnDef: 'notes', header: 'Notes', cell: (element: any) => `${element.notes}` },
    { columnDef: 'priority', header: 'Priority', cell: (element: any) => `${element.priority}` },
    { columnDef: 'requiredDate', header: 'Required Date', cell: (element: any) => `${element.requiredDate}` },
    { columnDef: 'revision', header: 'Revision', cell: (element: any) => `${element.revision}` },
    { columnDef: 'row', header: 'Row', cell: (element: any) => `${element.row}` },
    { columnDef: 'serialNumber', header: 'Serial Number', cell: (element: any) => `${element.serialNumber}` },
    { columnDef: 'shelf', header: 'Shelf', cell: (element: any) => `${element.shelf}` },
    { columnDef: 'statusCode', header: 'Status Code', cell: (element: any) => `${element.statusCode}` },
    { columnDef: 'toteID', header: 'Tote ID', cell: (element: any) => `${element.toteID}` },
    { columnDef: 'toteNumber', header: 'Tote Number', cell: (element: any) => `${element.toteNumber}` },
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
    { columnDef: 'warehouse', header: 'Warehouse', cell: (element: any) => `${element.warehouse}` },
    { columnDef: 'zone', header: 'Zone', cell: (element: any) => `${element.zone}` },
  ];

  displayedTransColumns = this.filterTransColumns.map(c => c.columnDef);

  orderTransDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorTrans') paginatorTrans: MatPaginator;
  @ViewChild(MatSort) viewTransSort: MatSort;

  // @ViewChild(MatPaginator, {static: false})
  // set paginatorTrans(value: MatPaginator) {
  //   if (this.orderTransDataSource){
  //     this.orderTransDataSource.paginator = value;
  //   }
  // }
  constructor(
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getAllOrders();
    

  }

  getAllOrders() {
    let paylaod = {
      "OrderView": this.data.viewType,
      "wsid": this.userData.wsid,
    }
    this.Api.OrdersInZone(paylaod).subscribe((res) => {
      // console.log(res);
      
      if (res.data.length > 0) {
        res.data.map(val => {
          this.allOrders.push({ 'orderNumber': val, isSelected: false });
        });
        // console.log(this.allOrders);
        // console.log(this.data.allOrders);
        if (this.data.allOrders.length > 0) {
          const selectedArr = this.allOrders.filter(element => this.data.allOrders.includes(element.orderNumber));
          
          selectedArr.map(ele => {
            ele.isSelected = true
            this.selectedOrders.push(ele.orderNumber);
          });
          // this.onOrderSelect(selectedArr[selectedArr.length -1]);
        }

        this.orderDataSource = new MatTableDataSource<any>(this.allOrders);
        this.orderDataSource.paginator = this.paginator;
        this.isDisableSubmit = false;

      }
      else{
        this.toastr.error('There are no orders for your zone', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.isDisableSubmit = true
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
      this.allOrders.filter(val => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.orderTransDataSource = [];
        }
      });
      this.selectedOrders = this.selectedOrders.filter(item => item !== row.orderNumber)
    }
    else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.toastr.error('No open totes in batch', 'Batch is Filled.', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      this.selectedOrders.push(row.orderNumber);
      this.allOrders.filter(val => {
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
        "Username": this.userData.username,
        "wsid": this.userData.wsid,
      }
      this.Api.InZoneTransDT(paylaod).subscribe((res) => {
        if (res.data) {
          this.transData = res.data.pickToteManTrans;
          this.orderTransDataSource = new MatTableDataSource<any>(this.transData);
          this.orderTransDataSource.paginator = this.paginatorTrans;
          this.orderTransDataSource.sort = this.viewTransSort;
        }
      });
    }



  }
  onSelectedOrders() {
    this.dialogRef.close(this.selectedOrders);
  }

}
