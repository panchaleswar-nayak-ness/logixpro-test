import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-unverified-item',
  templateUrl: './unverified-item.component.html',
  styleUrls: ['./unverified-item.component.scss']
})
export class UnverifiedItemComponent implements OnInit {
@Input() startSelectFilterLabel:any;
@Input() startSelectFilter:any;
@Input() filterOption:any; 
@Input() filterValue:any; 
@Input() tableData_1:any; 
@Input() isitemVisible:any; 
@Input() issupplyVisible:any; 
@Input() verifybtn:any; 

@Input() searchAutocompleteItemNum:any; 
@Input() displayedColumns_1:any;  
 @Output() selected = new EventEmitter<any>();
 @Output() filterVal = new EventEmitter<any>();
 @Output() verify = new EventEmitter<any>(); 
 @Output()  verifyal= new EventEmitter<any>(); 
 @Output()  autocomplete= new EventEmitter<any>(); 
 @Output()  Row= new EventEmitter<any>();  
 
 searchByItem: any = new Subject<string>();
 @ViewChild('paginator') paginator: MatPaginator;
 
 @ViewChild('matSort1') sort1: MatSort;
  constructor(   private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem()
      });
  }
  ngOnChanges(){
    this.tableData_1.sort = this.sort1;
    this.tableData_1.paginator = this.paginator;
  }
  getSelected($event:any){
    this.selected.emit($event);
  }
  filtervalue($event:any){
    this.filterVal.emit($event);
  }
  verifyLine(element: any, Index?: any){
    this.verify.emit(element);
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.tableData_1.sort = this.sort1;
  }
  verifyAll(){
    this.verifyal.emit(true);
  }
  getRow(val:any){
    this.Row.emit(val);
  }
  autocompleteSearchColumnItem(){
    this.autocomplete.emit(this.filterValue)
  }
}
