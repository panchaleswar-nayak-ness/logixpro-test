import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-verified-item',
  templateUrl: './verified-item.component.html',
  styleUrls: ['./verified-item.component.scss']
})
export class VerifiedItemComponent  {
  @Input() displayedColumns_2:any;  
  @Input() tableData_2:any;  
  @Input() unverifybtn:any;  
  @Output() unverify = new EventEmitter<any>(); 
  @Output()  unverifyal= new EventEmitter<any>();  
  @ViewChild('paginator2') paginator2: MatPaginator; 
  @ViewChild('matSort2') sort2: MatSort;
  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  
  ngOnChanges(){
    this.tableData_2.sort = this.sort2;
    this.tableData_2.paginator = this.paginator2;
  }
  
  announceSortChange2(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.tableData_2.sort = this.sort2;
  }
  unVerifyAll(){
    this.unverifyal.emit(true);
  }
  unverifyLine(element: any, Index?: any){
    this.unverify.emit(element);
  }
}
