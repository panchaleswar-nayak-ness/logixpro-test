import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  orderNoEvent: Event;
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
  constructor(
    private authService: AuthService,
    private Api:ApiFuntions,
  ) {

 
  }
  ngOnInit(): void {

    this.userData = this.authService.userData();
    // this.autocompleteSearchColumn();
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
  
}
