import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order, OrderLine } from 'src/app/common/Model/bulk-transactions';
import { LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';

interface MatDialogData {
  from : string,
  details: OrderLine[]
}
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {

  ordNum: string;
  transType: string;
  ordersDisplayedColumns: string[] = ["location", "itemNumber", "description", "transactionQuantity", 
     "priority", "unitOfMeasure", "warehouse", "toteId", "userField1", "userField2", "expirationDate", "lotNumber", 
    "serialNumber", "notes"];
  orderLines: MatTableDataSource<OrderLine>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor( 
    private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
    public dialogRef: MatDialogRef<OrderDetailsComponent>
  ) {}

  ngOnInit(): void {
    this.setOrderLinesTable(this.data.details);
  }

  ngAfterViewInit(): void {
    this.updatedPaginator();
  }

  setOrderLinesTable(orderLines: OrderLine[]){
    this.orderLines = new MatTableDataSource(orderLines);
    this.updatedPaginator();
    this.updateSorting();
    this.ordNum = orderLines[0].orderNumber ?? "";
    this.transType = orderLines[0].transactionType ?? "";
  }

  updatedPaginator(){
    this.orderLines.paginator = this.paginator;
  }

  updateSorting(){
    this.orderLines.sort = this.sort;
  }

  announceSortChange(sortState: Sort) { 
    if (sortState.direction) this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    this.updateSorting();
  }

  closePopup(){
    this.dialogRef.close("Yes");
  }

}
