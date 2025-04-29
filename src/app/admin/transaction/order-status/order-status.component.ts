import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service'; 
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { CurrentTabDataService } from '../../inventory-master/current-tab-data-service';
import { NumberHolder, StringHolder } from 'src/app/common/Model/holders';
import { ColumnAlias } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: [],
})
export class OrderStatusComponent implements OnInit {
  orderNoEvent: Event;
  @Input() tabIndex:any;
  toteIdEvent: Event;
  openOrderEvent: NumberHolder;
  completeOrderEvent: NumberHolder;
  reprocessOrderEvent: NumberHolder;
  orderTypeOrderEvent: StringHolder;
  totalLinesOrderEvent: NumberHolder;
  currentStatusOrderEvent: StringHolder;
  locationZonesEvent: Event;
  orderStatusNext = [];
  clearEvent: Event;
  clearFromList: Event;
  @Input() fieldNames: ColumnAlias;
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

  openOrderChange(event: NumberHolder) {
    this.openOrderEvent = event;
  }
  reprocessOrderChange(event: NumberHolder) {
    this.reprocessOrderEvent = event;
  }
  orderTypeOrderChange(event: StringHolder) {
    this.orderTypeOrderEvent = event;
  }
  completeOrderChange(event: NumberHolder) {
    this.completeOrderEvent = event;
  }
  totalLinesOrderChange(event: NumberHolder) {
    this.totalLinesOrderEvent = event;
  }
  currentStatusOrderChange(event: StringHolder) {
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
