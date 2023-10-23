import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-count-select-orders-component',
  templateUrl: './count-select-orders-component.component.html',
  styleUrls: ['./count-select-orders-component.component.scss']
})
export class CountSelectOrdersComponentComponent {
 
    @ViewChild('paginator1') paginator1: MatPaginator; 
    @ViewChild('matSort1') sort1: MatSort;
@Input() searchOrder1 : string='';
@Input() rightTable : any;
@Input() displayedColumns1 : string[];
@Output() applyFilter1Emit = new EventEmitter();
@Output() deleteItemEmit = new EventEmitter();
@Output() announceSortChange1Emit : EventEmitter<{ sortState : Sort }> = new EventEmitter();
@Output() removeEmit = new EventEmitter();
ngOnChanges() {  
  this.rightTable.paginator = this.paginator1;
  this.rightTable.sort = this.sort1;
}
applyFilter1(filterValue){
  this.applyFilter1Emit.emit(this.searchOrder1);
}
deleteItem(){
  this.deleteItemEmit.emit();
}
announceSortChange1(sortState){
  this.announceSortChange1Emit.emit(sortState);
}
remove(e){
  this.removeEmit.emit(e);
}
}
