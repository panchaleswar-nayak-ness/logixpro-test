import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-order-selection-list',
  templateUrl: './order-selection-list.component.html',
  styleUrls: ['./order-selection-list.component.scss']
})
export class OrderSelectionListComponent implements OnInit {

  @Input() ordersDisplayedColumns: string[];
  @Input() orders: any = [];
  @Input() view;
  @Input() batchSeleted;
  datasource:any = [];
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectOrderEmitter = new EventEmitter<any>();
  @Output() appendAllEmitter = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableHeading = "Batch Selection List";
  @ViewChild('paginator1') paginator1: MatPaginator;
  constructor( private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
     
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.view == "batch"){
      this.tableHeading = "Batch Selection List";
    } 
    else if(this.view  == "tote"){
      this.tableHeading = "Tote Selection List";
    }
    else if(this.view  == "order"){
      this.tableHeading = "Order Selection List";
    }  
    this.datasource = new MatTableDataSource(this.orders);
    if(this.orders.length) this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator1;
  }
  announceSortChange(sortState: Sort) { 
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.datasource.sort = this.sort;
  }
  selectOrder(order:any){
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



}
