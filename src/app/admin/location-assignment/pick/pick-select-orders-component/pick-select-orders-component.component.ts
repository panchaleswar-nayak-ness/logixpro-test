import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-pick-select-orders-component',
  templateUrl: './pick-select-orders-component.component.html',
  styleUrls: ['./pick-select-orders-component.component.scss']
})
export class PickSelectOrdersComponentComponent implements OnInit {

  @Input() filterValue : string;
  @Input() tableData2 : any;
  @Input() displayedColumns2 : string[];
  @Output() applyFilterEmit = new EventEmitter();
  @Output() removeAllEmit = new EventEmitter();
  @Output() announceSortChange2Emit : EventEmitter<{ sortState : Sort }> = new EventEmitter();
  @Output() removeEmit = new EventEmitter();
  @ViewChild('paginator2') paginator2: MatPaginator; 
  @ViewChild('MatSort2') sort2: MatSort;
  
  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event){
    this.applyFilterEmit.emit(event);
  }
  removeAll(){
    this.removeAllEmit.emit();
  }
  announceSortChange2(sortState){
    this.announceSortChange2Emit.emit(sortState);
  }
  remove(e){
    this.removeEmit.emit(e);
  }
  ngOnChanges() {  
    this.tableData2.paginator = this.paginator2;
    this.tableData2.sort = this.sort2;
  }
}
