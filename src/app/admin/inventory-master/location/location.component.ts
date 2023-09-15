import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @Input() fieldNameDetails: any;
  currentDir='asc';
  nextDir='desc';
  counter=0;
  displayedColumns: string[] = ['location','warehouse','zone','carousal','row','shelf','bin','lotNo','expiration','serialNo','cellSize','shipVia','shipToName',
'qtyAllPick', 'qtyAllPut', 'unitOfMeasure', 'itemQty',  'stockDate', 'velocity'];

  @Input() location: FormGroup;
  @Input() count: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendNotification(e?) {
    this.notifyParent.emit(e);
  }
  
  constructor() { }

  ngOnInit(): void { 
    setTimeout(() => {
      this.location.controls['inventoryTable'].value.sort = this.sort;
      });
  }
  ngOnChanges(changes: SimpleChanges) { 
    if(changes['location']){
      if( changes['location'] && changes['location']['previousValue'] &&  changes['location']['previousValue']['controls'] && changes['location']['previousValue']['controls'].inventoryTable.value?.length ){
        this.location.controls['inventoryTable'].setValue(changes['location']['previousValue']['controls'].inventoryTable.value)

      }else{
        this.location.controls['inventoryTable'].setValue([])
      }
    }
    if(changes['fieldNameDetails']){
      this.fieldNameDetails=changes['fieldNameDetails']
      
    }
  }
    
  announceSortChange(sortState: any) {
    this.counter++;
   
      if(this.counter%2===0){
        sortState.direction=this.currentDir;
      }else{
        sortState.direction=this.nextDir;
      }
    // if (sortState.direction != "") {
    //   this.nextDir = sortState.direction === "asc" ? "desc" : "asc";
    //   // this.nextDir = this.nextDir  === "asc" ? "desc" : "asc";
    // }
    // if(sortState.direction!=''){

      this.sendNotification({sortingColumn: this.displayedColumns.indexOf(sortState.active) , sortingSeq:sortState.direction})

    // }else{
    //   this.sendNotification({sortingColumn: this.displayedColumns.indexOf(sortState.active) , sortingSeq:this.nextDir})

    // }
   
  }

  refreshGrid(){
  this.sendNotification({refreshLocationGrid: true});
  }

  handlePageEvent(e: PageEvent) {
   
    
    this.sendNotification({locationPageSize:(e.pageSize*e.pageIndex + e.pageSize), startIndex: e.pageSize*e.pageIndex})
    
  }
  
}
