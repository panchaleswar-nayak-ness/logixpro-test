import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service'; 
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { CurrentTabDataService } from '../../inventory-master/current-tab-data-service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: [],
})
export class OrderStatusComponent implements OnInit {
  orderNoEvent: Event;
  @Input() tabIndex:any;
  toteIdEvent: Event;
  openOrderEvent: Event;
  completeOrderEvent: Event;
  reprocessOrderEvent: Event;
  orderTypeOrderEvent: Event;
  totalLinesOrderEvent: Event;
  currentStatusOrderEvent: Event;
  locationZonesEvent: Event;
  orderStatusNext = [];
  clearEvent: Event;
  clearFromList: Event;
  event: Event;
  userData;
  orderStatusTable:any
  constructor(
    private authService: AuthService,
    private Api:ApiFuntions,
    private currentTabDataService: CurrentTabDataService
  ) {

 
  }
  ngOnInit(): void {
    this.userData = this.authService.userData();
    if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT]) {
      let param = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT];
      this.orderStatusTable = {
        searchCol: param.searchCol,
        searchField: param.searchString
      };
    } else {
      this.orderStatusTable = {}; // Ensure this is defined even if the data is not available
    }
    
  }
  onClearFromStatus(event: Event) {
    this.clearEvent = event;
  }
  orderNoChange(event: Event) {
    this.orderNoEvent = event;
  }
  toteIdChange(event: Event) {
    this.toteIdEvent = event;
  }

  openOrderChange(event: Event) {
    this.openOrderEvent = event;
  }
  reprocessOrderChange(event: Event) {
    this.reprocessOrderEvent = event;
  }
  orderTypeOrderChange(event: Event) {
    this.orderTypeOrderEvent = event;
  }
  completeOrderChange(event: Event) {
    this.completeOrderEvent = event;
  }
  totalLinesOrderChange(event: Event) {
    this.totalLinesOrderEvent = event;
  }
  currentStatusOrderChange(event: Event) {
    this.currentStatusOrderEvent = event;
  }
  locationZones(event: Event) {
    this.locationZonesEvent = event;
  }
  onChange(event: Event) {
    this.event = event;
  }
  onClearList(event: Event) {
    this.clearFromList = event;
  }


  orderStatusTableEvent(event: Event) {
    this.orderStatusTable = event;
  }
  
}
