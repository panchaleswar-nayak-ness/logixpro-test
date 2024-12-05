import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input,Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {  LiveAnnouncerMessage, Placeholders } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-verified-item',
  templateUrl: './verified-item.component.html',
  styleUrls: ['./verified-item.component.scss']
})
export class VerifiedItemComponent  {

  @Input() verifiedItemsColumns:any;  
  @Input() verifiedItems:any;  
  @Input() unverifyBtn:any;  
  @Output() unverify = new EventEmitter<any>(); 
  @Output()  unverifyAllEmit = new EventEmitter<any>();  
  @ViewChild('paginator') paginator: MatPaginator; 
  @ViewChild('sort') sort: MatSort;

  placeholders = Placeholders;

  constructor(
    private liveAnnouncer: LiveAnnouncer
    ) { }

  
  ngOnChanges(){
    this.verifiedItems.sort = this.sort;
    this.verifiedItems.paginator = this.paginator;
  }
  
  announceSortChange2(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.verifiedItems.sort = this.sort;
  }

  unVerifyAll(){
    this.unverifyAllEmit.emit(true);
  }

  unverifyLine(element: any){
    this.unverify.emit(element);
  }
}
