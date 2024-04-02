import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-selected-orders',
  templateUrl: './selected-orders.component.html',
  styleUrls: ['./selected-orders.component.scss']
})
export class SelectedOrdersComponent implements OnInit {

  @Input() selectedOrdersDisplayedColumns: string[];
  @Input() selectedOrders: any = [];
  @Input() view;
  @ViewChild(MatSort) sort: MatSort;
  @Output() removeOrderEmitter = new EventEmitter<any>();
  @Output() removeAllEmitter = new EventEmitter<any>(); 
  @ViewChild('paginator1') paginator1: MatPaginator;
  tableHeading = "Selected Batches";
  datasource:any = [];
  @Input() url:any;
  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.view == "batch"){
      this.tableHeading = "Selected Orders";
    } 
    else if(this.view  == "tote"){
      this.tableHeading = "Selected Totes";
    }
    else if(this.view  == "order"){
      this.tableHeading = "Selected Orders";
    }
    this.datasource = new MatTableDataSource(this.selectedOrders);
    if(this.selectedOrders.length) this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator1;
  }

  removeOrder(order: any) {
    this.removeOrderEmitter.emit(order);
    this.datasource = new MatTableDataSource(this.datasource.filteredData.filter((x: any) => x.id != order.id));
    this.datasource.sort = this.sort;
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
  removeAll(){
    this.removeAllEmitter.emit();
  }

}
