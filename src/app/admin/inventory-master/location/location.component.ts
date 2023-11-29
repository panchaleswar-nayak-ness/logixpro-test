import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {  TableConstant ,UniqueConstants,Column,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @Input() fieldNameDetails: any;
  currentDir=UniqueConstants.Asc;
  nextDir='desc';
  counter=0;
  displayedColumns: string[] = [TableConstant.Location,'warehouse',TableConstant.zone,'carousal',Column.Row,TableConstant.shelf,'bin','lotNo','expiration','serialNo',UniqueConstants.cellSize,'shipVia','shipToName', 'qtyAllPick', 'qtyAllPut', ColumnDef.UnitOfMeasure, 'itemQty',  'stockDate', 'velocity'];

  @Input() location: FormGroup;
  @Input() count: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
 
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  sendNotification(e?) {
    this.notifyParent.emit(e);
  }
  
  ngOnInit(): void { 
    setTimeout(() => this.location.controls['inventoryTable'].value.sort = this.sort);
  }

  ngOnChanges(changes: SimpleChanges) { 
    if(changes[TableConstant.Location])
      if (changes[TableConstant.Location]?.previousValue?.controls?.inventoryTable.value?.length) this.location.controls['inventoryTable'].setValue(changes[TableConstant.Location]['previousValue']['controls'].inventoryTable.value);
      else this.location.controls['inventoryTable'].setValue([]);
    if(changes['fieldNameDetails']) this.fieldNameDetails=changes['fieldNameDetails'];
  }
    
  announceSortChange(sortState: any) {
    this.counter++;
    if(this.counter % 2 === 0) sortState.direction=this.currentDir;
    else sortState.direction=this.nextDir;
    this.sendNotification({sortingColumn: this.displayedColumns.indexOf(sortState.active) , sortingSeq:sortState.direction});
  }

  refreshGrid(){
    this.sendNotification({refreshLocationGrid: true});
  }

  handlePageEvent(e: PageEvent) {
    this.sendNotification({locationPageSize:(e.pageSize * e.pageIndex + e.pageSize), startIndex: e.pageSize * e.pageIndex});
  }
  
}
