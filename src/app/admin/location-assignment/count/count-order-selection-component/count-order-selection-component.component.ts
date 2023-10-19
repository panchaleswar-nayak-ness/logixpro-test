import { Component, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-count-order-selection-component',
  templateUrl: './count-order-selection-component.component.html',
  styleUrls: ['./count-order-selection-component.component.scss']
})
export class CountOrderSelectionComponentComponent   {

  @ViewChild('paginator') paginator: MatPaginator; 
  @ViewChild('table1') table1: MatTable<any>;
  @ViewChild('matSort') sort: MatSort;
  @Input() searchOrder : string='';
  @Input() leftTable : any;
  @Input() displayedColumns : string[];
  @Output() applyFilterEmit = new EventEmitter();
  @Output() addOrdereDialogEmit = new EventEmitter<any>();
  @Output() announceSortChangeEmit : EventEmitter<{ sortState : Sort }> = new EventEmitter();
  @Output() addEmit = new EventEmitter();
  
  ngOnChanges() {  
    this.leftTable.paginator = this.paginator;
    this.leftTable.sort = this.sort;  
  }
  applyFilter(filterValue){
    this.applyFilterEmit.emit(this.searchOrder);
  }
  addOrdereDialog(){
    this.addOrdereDialogEmit.emit();
  }
  announceSortChange(sortState){
    this.announceSortChangeEmit.emit(sortState);
  }
  add(e){
    this.addEmit.emit(e);
  }

}
