import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-count-select-orders-component',
  templateUrl: './count-select-orders-component.component.html',
  styleUrls: ['./count-select-orders-component.scss']
})
export class CountSelectOrdersComponentComponent {
 
@ViewChild('paginator1') paginator1: MatPaginator; 
@ViewChild('matSort1') sort1: MatSort;
@Input() searchOrderRight : string='';
@Input() rightTable : any;
@Input() displayedColumnsSelectData : string[];
@Output() applyFilter1Emit = new EventEmitter();
@Output() deleteItemEmit = new EventEmitter();
@Output() announceSortChange1Emit : EventEmitter<{ sortState : Sort }> = new EventEmitter();
@Output() removeEmit = new EventEmitter();
ngOnChanges() {  
  this.rightTable.paginator = this.paginator1;
  this.rightTable.sort = this.sort1;
}
applyFilterRight(){
  this.applyFilter1Emit.emit(this.searchOrderRight);
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
