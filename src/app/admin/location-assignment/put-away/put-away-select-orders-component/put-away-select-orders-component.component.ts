import { Component, OnInit, Input, Output, EventEmitter,ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-put-away-select-orders-component',
  templateUrl: './put-away-select-orders-component.component.html',
  styleUrls: ['./put-away-select-orders-component.component.scss']
})
export class PutAwaySelectOrdersComponentComponent implements OnInit {

  @Input() filterValue2 : string;
  @Input() tableData2 : any;
  @Input() displayedColumns2 : string[];
  @Output() applyFilter2Emit = new EventEmitter();
  @Output() removeAllEmit = new EventEmitter();
  @Output() announceSortChange2Emit : EventEmitter<{ sortState : Sort }> = new EventEmitter();
  @Output() removeEmit = new EventEmitter;
  @ViewChild('paginator2') paginator2: MatPaginator; 
  @ViewChild('MatSort2') sort2: MatSort;
  constructor() { }

  ngOnInit(): void {
  }

  applyFilter2(event){
    this.applyFilter2Emit.emit(event);
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
