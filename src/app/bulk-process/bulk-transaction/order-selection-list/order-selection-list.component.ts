import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/common/Model/bulk-transactions';
import { DialogConstants, LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { PickRemainingComponent } from '../pick-remaining/pick-remaining.component';
import { OrderDetailsComponent } from 'src/app/dialogs/order-details/order-details.component';

@Component({
  selector: 'app-order-selection-list',
  templateUrl: './order-selection-list.component.html',
  styleUrls: ['./order-selection-list.component.scss']
})
export class OrderSelectionListComponent implements OnInit {
  @Input() url: any;
  @Input() ordersDisplayedColumns: string[];
  @Input() orders: any = [];
  @Input() view : string;
  @Input() batchSeleted: boolean;
  datasource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectOrderEmitter = new EventEmitter<any>();
  @Output() appendAllEmitter = new EventEmitter<any>(); 
  tableHeading : string = "Batch Selection List";
  @ViewChild('paginator1') paginator1: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private global: GlobalService,
  ) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if(this.view == "batch") this.tableHeading = "Batch Selection List";
    else if(this.view == "tote") this.tableHeading = "Tote Selection List";
    else if(this.view == "order") this.tableHeading = "Order Selection List";
    this.datasource = new MatTableDataSource(this.orders);
    if(this.orders.length) this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator1;
  }

  announceSortChange(sortState: Sort) { 
    if (sortState.direction) this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    this.datasource.sort = this.sort;
  }

  selectOrder(order : any) {
    if(!this.batchSeleted){
      this.selectOrderEmitter.emit(order);
      this.datasource = new MatTableDataSource(this.datasource.filteredData.filter((x:any) => x.id != order.id));
      this.datasource.paginator = this.paginator1;
      this.datasource.sort = this.sort;
    }
  }

  appendAll(){
    this.appendAllEmitter.emit();
  }

  viewDetails(element : Order) {
    console.log(element);
    const dialogRefTote = this.global.OpenDialog(OrderDetailsComponent, {
      height: DialogConstants.auto,
      width: '990px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        from: 'BulkTransaction',
        details: element.orderLines
      }
    });
    dialogRefTote.afterClosed().subscribe((result) => {});
  }
}
